import { formatUnits, parseUnits } from "viem";
import { USDC_DECIMALS } from "./contracts";

export function fromUsdc(raw: bigint | undefined): string {
  if (raw === undefined) return "—";
  return formatUnits(raw, USDC_DECIMALS);
}

export function toUsdc(human: string): bigint {
  return parseUnits(human || "0", USDC_DECIMALS);
}

export function shortAddr(a?: string): string {
  if (!a) return "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export const stateLabel = [
  "Created",
  "Funded — awaiting work",
  "Submitted — awaiting client review",
  "Approved",
  "Paid",
  "In dispute",
  "Resolved",
  "Refunded",
];

export const escrowStatusLabel = [
  "Awaiting deposit",
  "Funds locked",
  "Closed",
];
