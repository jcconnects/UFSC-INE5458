import { EscrowView } from "@/components/EscrowView";
import type { Address } from "viem";

export default function EscrowPage({ params }: { params: { address: string } }) {
  const a = params.address as Address;
  return <EscrowView escrow={a} />;
}
