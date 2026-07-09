"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { MockUSDCAbi } from "@/lib/abis/MockUSDC";
import { MOCK_USDC_ADDRESS, USDC_DECIMALS } from "@/lib/contracts";
import { DEMO_MODE } from "@/lib/wagmi";
import { fromUsdc } from "@/lib/format";
import { ActionButton } from "./ActionButton";
import { parseUnits } from "viem";

export function TokenBalance() {
  const { address } = useAccount();
  const { data: balance, refetch } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: MockUSDCAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 4000 },
  });

  const { writeContract, data: hash, isPending } = useWriteContract();

  const mint = () => {
    if (!address) return;
    writeContract({
      address: MOCK_USDC_ADDRESS,
      abi: MockUSDCAbi,
      functionName: "mint",
      args: [address, parseUnits("1000", USDC_DECIMALS)],
    });
  };

  return (
    <div className="rounded-lg border border-white/10 p-5 flex items-center justify-between gap-4">
      <div>
        <div className="text-xs uppercase opacity-60 tracking-wider">mUSDC balance</div>
        <div className="text-2xl font-semibold">{address ? fromUsdc(balance as bigint | undefined) : "—"}</div>
        <div className="text-xs opacity-50 mt-1">Demo token. Has a public mint — not real USDC.</div>
      </div>
      {/* Hidden in demo mode: balances are pre-seeded by demo-up; a stray
          click here would break the clean 1,000 / 0 numbers on camera. */}
      {!DEMO_MODE && (
        <ActionButton
          variant="secondary"
          label="Get 1,000 mUSDC"
          pending={isPending}
          txHash={hash}
          disabled={!address}
          onClick={mint}
          onConfirmed={() => refetch()}
        />
      )}
    </div>
  );
}
