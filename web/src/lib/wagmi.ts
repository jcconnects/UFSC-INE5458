"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createConfig, createConnector, http } from "wagmi";
import { createWalletClient, defineChain, http as viemHttp } from "viem";
import { privateKeyToAccount } from "viem/accounts";
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

// ---------------------------------------------------------------------------
// Demo mode (NEXT_PUBLIC_DEMO=1): the recorded demo runs with two pre-wired
// wallets — no browser extension, no popups. Keys below are anvil's default
// dev accounts #0/#1: universally known, local-chain only, never real funds.
// ---------------------------------------------------------------------------

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO === "1";
export const DEMO_ROLE_STORAGE_KEY = "trustpay-demo-role";

export type DemoRole = "client" | "freelancer";

export const DEMO_ACCOUNTS: Record<DemoRole, `0x${string}`> = {
  client: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  freelancer: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
};

const DEMO_KEYS: Record<DemoRole, `0x${string}`> = {
  client: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  freelancer: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
};

export function storedDemoRole(): DemoRole | null {
  if (typeof window === "undefined") return null;
  const v = window.sessionStorage.getItem(DEMO_ROLE_STORAGE_KEY);
  return v === "client" || v === "freelancer" ? v : null;
}

/** A wagmi connector that signs locally with a fixed demo key. */
function demoConnector(role: DemoRole) {
  return createConnector((_config) => {
    const account = privateKeyToAccount(DEMO_KEYS[role]);
    const walletClient = createWalletClient({
      account,
      chain: chainWithRpc,
      transport: viemHttp(rpcUrl ?? chainWithRpc.rpcUrls.default.http[0]),
    });
    return {
      id: `demo-${role}`,
      name: role === "client" ? "Demo Client" : "Demo Freelancer",
      type: "demo" as const,
      // Promise<any>: wagmi's connect() is generic over an optional
      // "capabilities" account shape this demo connector never uses.
      async connect(): Promise<any> {
        return { accounts: [account.address], chainId: chainWithRpc.id };
      },
      async disconnect() {},
      async getAccounts() {
        return [account.address] as readonly `0x${string}`[];
      },
      async getChainId() {
        return chainWithRpc.id;
      },
      // wagmi routes writeContract/sendTransaction through this client.
      async getClient() {
        return walletClient;
      },
      async getProvider() {
        return walletClient.transport;
      },
      // Lets wagmi auto-reconnect the right role after in-app navigation,
      // while the other window (other sessionStorage) reconnects its own.
      async isAuthorized() {
        return storedDemoRole() === role;
      },
      onAccountsChanged() {},
      onChainChanged() {},
      onDisconnect() {},
    };
  });
}

export const wagmiConfig = DEMO_MODE
  ? createConfig({
      chains: [chainWithRpc],
      // chainWithRpc's type is the union of all three chains, so the record
      // must key every id; only the selected chain is ever used at runtime.
      transports: {
        [localAnvil.id]: http(rpcUrl),
        [sepolia.id]: http(rpcUrl),
        [polygonAmoy.id]: http(rpcUrl),
      },
      connectors: [demoConnector("client"), demoConnector("freelancer")],
      ssr: true,
    })
  : getDefaultConfig({
      appName: "TrustPay Escrow",
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo",
      chains: [chainWithRpc],
      ssr: true,
    });

export const activeChain = chainWithRpc;
