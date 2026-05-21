"use client";

import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { EscrowFactoryAbi } from "@/lib/abis/EscrowFactory";
import { ESCROW_FACTORY_ADDRESS } from "@/lib/contracts";
import { shortAddr } from "@/lib/format";

export function EscrowList() {
  const { address } = useAccount();
  const { data, isLoading } = useReadContract({
    address: ESCROW_FACTORY_ADDRESS,
    abi: EscrowFactoryAbi,
    functionName: "escrowsOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 6000 },
  });

  const list = (data as readonly `0x${string}`[] | undefined) ?? [];

  if (!address) {
    return <div className="opacity-70">Connect a wallet to see your escrows.</div>;
  }
  if (isLoading) return <div className="opacity-70">Loading…</div>;
  if (list.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/15 p-6 text-center opacity-80">
        No escrows yet. <Link className="underline" href="/create">Create one →</Link>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {list.map((addr) => (
        <li key={addr}>
          <Link
            href={`/escrow/${addr}`}
            className="block rounded-lg border border-white/10 hover:border-white/30 px-4 py-3"
          >
            <div className="text-xs opacity-60">Escrow</div>
            <div className="font-mono">{shortAddr(addr)}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
