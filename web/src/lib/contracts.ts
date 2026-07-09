import type { Address } from "viem";

// IMPORTANT: Next.js only inlines NEXT_PUBLIC_* into the client bundle for
// LITERAL `process.env.NAME` expressions — a dynamic `process.env[name]`
// lookup is undefined in the browser and silently yields the zero address.
const ZERO = "0x0000000000000000000000000000000000000000" as Address;

export const MOCK_USDC_ADDRESS = (process.env.NEXT_PUBLIC_MOCK_USDC ?? ZERO) as Address;
export const ESCROW_FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_ESCROW_FACTORY ?? ZERO) as Address;
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
