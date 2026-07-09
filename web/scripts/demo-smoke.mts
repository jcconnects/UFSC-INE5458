/**
 * Headless smoke test of the recorded demo flow (beats 1–4), driven through
 * the app's real wagmi config and demo connectors — the exact code path the
 * UI buttons use. Run AFTER `pnpm demo:up` is serving (in another terminal):
 *
 *   pnpm demo:smoke
 *
 * Asserts final state: client 700 / freelancer 100 / escrow 200 mUSDC.
 */
process.env.NEXT_PUBLIC_DEMO = "1";
process.env.NEXT_PUBLIC_CHAIN_ID = "31337";
process.env.NEXT_PUBLIC_RPC_URL = "http://127.0.0.1:8545";

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { keccak256, parseUnits, toHex, decodeEventLog } from "viem";
import {
  connect,
  disconnect,
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "wagmi/actions";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const deployments = JSON.parse(
  readFileSync(path.resolve(__dirname, "../../contracts/deployments/31337.json"), "utf8")
);
process.env.NEXT_PUBLIC_MOCK_USDC = deployments.mockUSDC;
process.env.NEXT_PUBLIC_ESCROW_FACTORY = deployments.escrowFactory;

const { wagmiConfig, DEMO_ACCOUNTS } = await import("../src/lib/wagmi");
const { MockUSDCAbi } = await import("../src/lib/abis/MockUSDC");
const { EscrowFactoryAbi } = await import("../src/lib/abis/EscrowFactory");
const { EscrowAbi } = await import("../src/lib/abis/Escrow");

const USDC = deployments.mockUSDC as `0x${string}`;
const FACTORY = deployments.escrowFactory as `0x${string}`;
const M100 = parseUnits("100", 6);

const connectorById = (id: string) => {
  const c = wagmiConfig.connectors.find((c) => c.id === id);
  if (!c) throw new Error(`connector ${id} not found`);
  return c;
};

async function as(role: "client" | "freelancer", fn: () => Promise<void>) {
  await connect(wagmiConfig, { connector: connectorById(`demo-${role}`) });
  try {
    await fn();
  } finally {
    await disconnect(wagmiConfig);
  }
}

async function tx(params: Parameters<typeof writeContract>[1]) {
  const hash = await writeContract(wagmiConfig, params);
  await waitForTransactionReceipt(wagmiConfig, { hash });
  return hash;
}

const balanceOf = (who: `0x${string}`) =>
  readContract(wagmiConfig, {
    address: USDC,
    abi: MockUSDCAbi,
    functionName: "balanceOf",
    args: [who],
  }) as Promise<bigint>;

function assertEq(label: string, got: unknown, want: unknown) {
  if (got !== want) throw new Error(`ASSERT ${label}: got ${got}, want ${want}`);
  console.log(`  ✓ ${label} = ${got}`);
}

console.log("beat 0 — starting balances");
assertEq("client mUSDC", await balanceOf(DEMO_ACCOUNTS.client), parseUnits("1000", 6));
assertEq("freelancer mUSDC", await balanceOf(DEMO_ACCOUNTS.freelancer), 0n);

let escrow: `0x${string}` = "0x";
console.log("beat 1 — client creates 3×100 escrow");
await as("client", async () => {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const hash = await tx({
    address: FACTORY,
    abi: EscrowFactoryAbi,
    functionName: "createEscrow",
    args: [
      DEMO_ACCOUNTS.freelancer,
      USDC,
      [M100, M100, M100],
      [now + 86400n, now + 172800n, now + 259200n],
    ],
  });
  const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
  for (const log of receipt.logs) {
    try {
      const parsed = decodeEventLog({ abi: EscrowFactoryAbi, data: log.data, topics: log.topics });
      if (parsed.eventName === "EscrowCreated") {
        escrow = (parsed.args as { escrow: `0x${string}` }).escrow;
      }
    } catch {}
  }
  if (escrow === "0x") throw new Error("EscrowCreated event not found");
  console.log(`  ✓ escrow deployed at ${escrow}`);
});

console.log("beat 2 — client approves + deposits 300");
await as("client", async () => {
  await tx({ address: USDC, abi: MockUSDCAbi, functionName: "approve", args: [escrow, M100 * 3n] });
  await tx({ address: escrow, abi: EscrowAbi, functionName: "deposit" });
});
assertEq("escrow locked", await balanceOf(escrow), parseUnits("300", 6));
assertEq("client after lock", await balanceOf(DEMO_ACCOUNTS.client), parseUnits("700", 6));

console.log("beat 3 — freelancer submits milestone 1 (hash)");
await as("freelancer", async () => {
  const deliverableHash = keccak256(toHex("TrustPay demo deliverable — milestone 1"));
  await tx({ address: escrow, abi: EscrowAbi, functionName: "submitMilestone", args: [0n, deliverableHash] });
});

console.log("beat 4 — client approves, releases 100");
await as("client", async () => {
  await tx({ address: escrow, abi: EscrowAbi, functionName: "approveMilestone", args: [0n] });
  await tx({ address: escrow, abi: EscrowAbi, functionName: "releasePayment", args: [0n] });
});

assertEq("freelancer paid", await balanceOf(DEMO_ACCOUNTS.freelancer), parseUnits("100", 6));
assertEq("escrow remaining", await balanceOf(escrow), parseUnits("200", 6));
assertEq("client final", await balanceOf(DEMO_ACCOUNTS.client), parseUnits("700", 6));

const summary = (await readContract(wagmiConfig, {
  address: escrow,
  abi: EscrowAbi,
  functionName: "summary",
})) as readonly [unknown, unknown, unknown, bigint, number, bigint];
assertEq("escrow status Active", summary[4], 1);

console.log("\nSMOKE TEST PASSED — full happy path works through the demo connectors.");
console.log("NOTE: this run consumed chain state. Re-run `pnpm demo:up` before recording.");
process.exit(0);
