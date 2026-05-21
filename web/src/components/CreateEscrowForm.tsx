"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { decodeEventLog, isAddress, parseUnits } from "viem";
import { EscrowFactoryAbi } from "@/lib/abis/EscrowFactory";
import { ESCROW_FACTORY_ADDRESS, MOCK_USDC_ADDRESS, USDC_DECIMALS } from "@/lib/contracts";

type Row = { amount: string; days: string };

export function CreateEscrowForm() {
  const router = useRouter();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [freelancer, setFreelancer] = useState("");
  const [rows, setRows] = useState<Row[]>([
    { amount: "100", days: "1" },
    { amount: "100", days: "2" },
    { amount: "100", days: "3" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const total = useMemo(
    () => rows.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [rows]
  );

  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: mining } = useWaitForTransactionReceipt({ hash });

  const addRow = () => setRows([...rows, { amount: "", days: "" }]);
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Row, v: string) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [field]: v } : r)));

  const submit = async () => {
    setError(null);
    if (!address) return setError("Connect wallet first.");
    if (!isAddress(freelancer)) return setError("Freelancer address is invalid.");
    if (freelancer.toLowerCase() === address.toLowerCase())
      return setError("Freelancer cannot be the same as the client.");
    if (rows.length === 0) return setError("Add at least one milestone.");

    const amounts: bigint[] = [];
    const deadlines: bigint[] = [];
    const now = BigInt(Math.floor(Date.now() / 1000));
    for (const r of rows) {
      const a = Number(r.amount);
      const d = Number(r.days);
      if (!a || a <= 0) return setError("Each milestone needs a positive amount.");
      if (!d || d <= 0) return setError("Each milestone needs a deadline in days.");
      amounts.push(parseUnits(r.amount, USDC_DECIMALS));
      deadlines.push(now + BigInt(d) * 86400n);
    }

    try {
      setCreating(true);
      const txHash = await writeContractAsync({
        address: ESCROW_FACTORY_ADDRESS,
        abi: EscrowFactoryAbi,
        functionName: "createEscrow",
        args: [freelancer as `0x${string}`, MOCK_USDC_ADDRESS, amounts, deadlines],
      });
      const receipt = await publicClient!.waitForTransactionReceipt({ hash: txHash });
      // pluck escrow address from EscrowCreated event
      let newEscrow: `0x${string}` | null = null;
      for (const log of receipt.logs) {
        try {
          const parsed = decodeEventLog({ abi: EscrowFactoryAbi, data: log.data, topics: log.topics });
          if (parsed.eventName === "EscrowCreated") {
            newEscrow = (parsed.args as { escrow: `0x${string}` }).escrow;
            break;
          }
        } catch {
          /* not our event */
        }
      }
      if (newEscrow) router.push(`/escrow/${newEscrow}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm opacity-70">Freelancer address</label>
        <input
          value={freelancer}
          onChange={(e) => setFreelancer(e.target.value)}
          placeholder="0x…"
          className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 font-mono text-sm"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Milestones</h3>
          <button onClick={addRow} className="text-sm underline opacity-80 hover:opacity-100">
            + Add milestone
          </button>
        </div>
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 text-sm opacity-60">#{i + 1}</div>
              <input
                value={r.amount}
                onChange={(e) => update(i, "amount", e.target.value)}
                placeholder="100"
                inputMode="decimal"
                className="col-span-5 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm"
              />
              <span className="col-span-1 text-sm opacity-60">mUSDC</span>
              <input
                value={r.days}
                onChange={(e) => update(i, "days", e.target.value)}
                placeholder="1"
                inputMode="numeric"
                className="col-span-3 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm"
              />
              <span className="col-span-1 text-sm opacity-60">days</span>
              <button
                onClick={() => removeRow(i)}
                className="col-span-1 text-sm opacity-50 hover:opacity-100"
                aria-label="Remove milestone"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="text-sm opacity-80">Total: {total} mUSDC</div>
      </div>

      {error && <div className="text-sm text-red-300">{error}</div>}

      <button
        disabled={creating || isPending || mining}
        onClick={submit}
        className="px-5 py-2 rounded-md bg-brand text-brand-fg font-medium disabled:opacity-40"
      >
        {creating || isPending ? "Confirm in wallet…" : mining ? "Mining…" : "Create escrow"}
      </button>
    </div>
  );
}
