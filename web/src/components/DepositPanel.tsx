"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { MockUSDCAbi } from "@/lib/abis/MockUSDC";
import { EscrowAbi } from "@/lib/abis/Escrow";
import { MOCK_USDC_ADDRESS } from "@/lib/contracts";
import { fromUsdc } from "@/lib/format";

type Props = {
  escrow: `0x${string}`;
  client: `0x${string}`;
  total: bigint;
  onDeposited: () => void;
};

export function DepositPanel({ escrow, client, total, onDeposited }: Props) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const isClient = address?.toLowerCase() === client.toLowerCase();
  const { writeContractAsync, isPending } = useWriteContract();
  const [step, setStep] = useState<"idle" | "approving" | "depositing">("idle");
  const [err, setErr] = useState<string | null>(null);

  const { data: allowance } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: MockUSDCAbi,
    functionName: "allowance",
    args: address ? [address, escrow] : undefined,
    query: { enabled: !!address, refetchInterval: 4000 },
  });
  const { data: balance } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: MockUSDCAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 4000 },
  });

  const needsApprove = ((allowance as bigint | undefined) ?? 0n) < total;
  const insufficient = ((balance as bigint | undefined) ?? 0n) < total;

  const go = async () => {
    setErr(null);
    try {
      if (needsApprove) {
        setStep("approving");
        const h = await writeContractAsync({
          address: MOCK_USDC_ADDRESS,
          abi: MockUSDCAbi,
          functionName: "approve",
          args: [escrow, total],
        });
        await publicClient!.waitForTransactionReceipt({ hash: h });
      }
      setStep("depositing");
      const h = await writeContractAsync({
        address: escrow,
        abi: EscrowAbi,
        functionName: "deposit",
      });
      await publicClient!.waitForTransactionReceipt({ hash: h });
      onDeposited();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setStep("idle");
    }
  };

  if (!isClient) {
    return (
      <div className="rounded-lg border border-white/10 p-5 opacity-80">
        Waiting for client to deposit {fromUsdc(total)} mUSDC.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-5 space-y-3">
      <div>
        <div className="text-xs uppercase opacity-60 tracking-wider">Action required</div>
        <div className="text-lg font-semibold">Deposit {fromUsdc(total)} mUSDC to lock funds</div>
        <div className="text-xs opacity-70 mt-1">
          Two transactions: approve, then deposit. The freelancer cannot start work until this lands on-chain.
        </div>
      </div>
      {err && <div className="text-sm text-red-300">{err}</div>}
      {insufficient && (
        <div className="text-sm text-red-300">
          Insufficient balance — use the faucet on the dashboard to mint mUSDC.
        </div>
      )}
      <button
        disabled={isPending || step !== "idle" || insufficient}
        onClick={go}
        className="px-5 py-2 rounded-md bg-brand text-brand-fg font-medium disabled:opacity-40"
      >
        {step === "approving"
          ? "Approve in wallet…"
          : step === "depositing"
            ? "Deposit in wallet…"
            : needsApprove
              ? `Approve + Deposit ${fromUsdc(total)} mUSDC`
              : `Deposit ${fromUsdc(total)} mUSDC`}
      </button>
    </div>
  );
}
