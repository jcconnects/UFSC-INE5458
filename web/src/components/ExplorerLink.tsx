"use client";

import { useChainId } from "wagmi";
import { explorerAddress } from "@/lib/contracts";
import type { Address } from "viem";

export function ExplorerLink({ address, label }: { address: Address; label?: string }) {
  const chainId = useChainId();
  return (
    <a
      href={explorerAddress(chainId, address)}
      target="_blank"
      rel="noopener noreferrer"
      className="underline opacity-80 hover:opacity-100 font-mono"
    >
      {label ?? address}
    </a>
  );
}
