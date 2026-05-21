"use client";

import { useAccount, useWriteContract } from "wagmi";
import { useState } from "react";
import { EscrowAbi } from "@/lib/abis/Escrow";
import { fromUsdc, stateLabel } from "@/lib/format";

export type Milestone = {
  amount: bigint;
  deadline: bigint;
  state: number;
  deliverableHash: `0x${string}`;
};

type Props = {
  escrow: `0x${string}`;
  client: `0x${string}`;
  freelancer: `0x${string}`;
  milestones: Milestone[];
  onMutated: () => void;
};

async function sha256(file: File): Promise<`0x${string}`> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  const bytes = Array.from(new Uint8Array(digest));
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `0x${hex}` as `0x${string}`;
}

export function MilestoneList({ escrow, client, freelancer, milestones, onMutated }: Props) {
  const { address } = useAccount();
  const isClient = address?.toLowerCase() === client.toLowerCase();
  const isFreelancer = address?.toLowerCase() === freelancer.toLowerCase();
  const { writeContractAsync, isPending } = useWriteContract();
  const [busyId, setBusyId] = useState<number | null>(null);

  const call = async (id: number, fn: () => Promise<unknown>) => {
    try {
      setBusyId(id);
      await fn();
      onMutated();
    } finally {
      setBusyId(null);
    }
  };

  const onSubmitMilestone = (id: number) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const hash = await sha256(file);
    await call(id, () =>
      writeContractAsync({
        address: escrow,
        abi: EscrowAbi,
        functionName: "submitMilestone",
        args: [BigInt(id), hash],
      })
    );
  };

  const onApprove = (id: number) =>
    call(id, () =>
      writeContractAsync({
        address: escrow,
        abi: EscrowAbi,
        functionName: "approveMilestone",
        args: [BigInt(id)],
      })
    );

  const onRelease = (id: number) =>
    call(id, () =>
      writeContractAsync({
        address: escrow,
        abi: EscrowAbi,
        functionName: "releasePayment",
        args: [BigInt(id)],
      })
    );

  return (
    <ul className="space-y-3">
      {milestones.map((m, i) => {
        const busy = isPending && busyId === i;
        return (
          <li key={i} className="rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase opacity-60 tracking-wider">Milestone {i + 1}</div>
                <div className="text-lg font-semibold">{fromUsdc(m.amount)} mUSDC</div>
                <div className="text-xs opacity-60 mt-1">
                  Deadline: {new Date(Number(m.deadline) * 1000).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase opacity-60 tracking-wider">Status</div>
                <div className="font-medium">{stateLabel[m.state]}</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {isFreelancer && m.state === 1 /* Funded */ && (
                <label className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 cursor-pointer text-sm">
                  {busy ? "Hashing & signing…" : "Submit milestone (choose file)"}
                  <input type="file" hidden onChange={onSubmitMilestone(i)} disabled={busy} />
                </label>
              )}
              {isClient && m.state === 2 /* Submitted */ && (
                <button
                  disabled={busy}
                  onClick={() => onApprove(i)}
                  className="px-3 py-2 rounded-md bg-brand text-brand-fg text-sm font-medium disabled:opacity-50"
                >
                  {busy ? "Confirming…" : "Approve"}
                </button>
              )}
              {(isClient || isFreelancer) && m.state === 3 /* Approved */ && (
                <button
                  disabled={busy}
                  onClick={() => onRelease(i)}
                  className="px-3 py-2 rounded-md bg-emerald-500 text-emerald-950 text-sm font-medium disabled:opacity-50"
                >
                  {busy ? "Confirming…" : "Release payment"}
                </button>
              )}
              {m.state === 4 /* Released */ && (
                <span className="text-sm text-emerald-300">✓ Paid to freelancer</span>
              )}
            </div>

            {m.deliverableHash !== "0x0000000000000000000000000000000000000000000000000000000000000000" && (
              <div className="mt-3 text-xs opacity-60 break-all font-mono">
                deliverable: {m.deliverableHash}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
