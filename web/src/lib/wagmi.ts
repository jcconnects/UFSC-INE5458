"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { sepolia, polygonAmoy } from "viem/chains";

const localAnvil = defineChain({
  id: 31337,
  name: "Local Anvil",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
});

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "31337");

const allChains = [localAnvil, sepolia, polygonAmoy] as const;
const selectedChain = allChains.find((c) => c.id === chainId) ?? localAnvil;

const chainWithRpc = rpcUrl
  ? { ...selectedChain, rpcUrls: { default: { http: [rpcUrl] }, public: { http: [rpcUrl] } } }
  : selectedChain;

export const wagmiConfig = getDefaultConfig({
  appName: "TrustPay Escrow",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo",
  chains: [chainWithRpc],
  ssr: true,
});

export const activeChain = chainWithRpc;
