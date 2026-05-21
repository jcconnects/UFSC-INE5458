"use client";

import { ReactNode, useEffect } from "react";
import { useWaitForTransactionReceipt, useChainId } from "wagmi";
import { explorerTx } from "@/lib/contracts";

type Props = {
  label: string;
  pending?: boolean;
  txHash?: `0x${string}`;
  disabled?: boolean;
  onClick: () => void;
  onConfirmed?: () => void;
  variant?: "primary" | "secondary";
  children?: ReactNode;
};

export function ActionButton({ label, pending, txHash, disabled, onClick, onConfirmed, variant = "primary" }: Props) {
  const chainId = useChainId();
  const { isLoading: mining, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && onConfirmed) onConfirmed();
  }, [isSuccess, onConfirmed]);

  const cls =
    variant === "primary"
      ? "bg-brand text-brand-fg hover:opacity-90"
      : "bg-white/10 text-white hover:bg-white/20";

  return (
    <div className="space-y-1">
      <button
        disabled={disabled || pending || mining}
        onClick={onClick}
        className={`px-4 py-2 rounded-md font-medium disabled:opacity-40 disabled:cursor-not-allowed ${cls}`}
      >
        {pending ? "Confirm in wallet…" : mining ? "Mining…" : label}
      </button>
      {txHash && (
        <div className="text-xs opacity-70">
          tx:&nbsp;
          <a
            className="underline"
            href={explorerTx(chainId, txHash)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txHash.slice(0, 10)}…{txHash.slice(-6)}
          </a>
          {isSuccess && <span className="ml-2 text-emerald-300">✓ confirmed</span>}
        </div>
      )}
    </div>
  );
}
