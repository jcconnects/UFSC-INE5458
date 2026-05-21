import type { Address } from "viem";

function envAddr(name: string): Address {
  const v = process.env[name];
  if (!v) return "0x0000000000000000000000000000000000000000" as Address;
  return v as Address;
}

export const MOCK_USDC_ADDRESS = envAddr("NEXT_PUBLIC_MOCK_USDC");
export const ESCROW_FACTORY_ADDRESS = envAddr("NEXT_PUBLIC_ESCROW_FACTORY");
export const USDC_DECIMALS = 6;

export function explorerTx(chainId: number, hash: `0x${string}`): string {
  switch (chainId) {
    case 11155111:
      return `https://sepolia.etherscan.io/tx/${hash}`;
    case 80002:
      return `https://amoy.polygonscan.com/tx/${hash}`;
    default:
      return `#${hash}`;
  }
}

export function explorerAddress(chainId: number, address: Address): string {
  switch (chainId) {
    case 11155111:
      return `https://sepolia.etherscan.io/address/${address}`;
    case 80002:
      return `https://amoy.polygonscan.com/address/${address}`;
    default:
      return `#${address}`;
  }
}
