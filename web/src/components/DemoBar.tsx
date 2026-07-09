"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { DEMO_ROLE_STORAGE_KEY, DemoRole, storedDemoRole } from "@/lib/wagmi";
import { MockUSDCAbi } from "@/lib/abis/MockUSDC";
import { MOCK_USDC_ADDRESS } from "@/lib/contracts";
import { fromUsdc, shortAddr } from "@/lib/format";

/**
 * Demo-mode replacement for the RainbowKit button. Resolves the window's role
 * from ?role=client|freelancer (persisted in sessionStorage, so each browser
 * window keeps its own role across navigation), auto-connects the matching
 * demo connector, and shows role + address + live mUSDC balance.
 */
export function DemoBar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [role, setRole] = useState<DemoRole | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const q = new URL(window.location.href).searchParams.get("role");
    if (q === "client" || q === "freelancer") {
      window.sessionStorage.setItem(DEMO_ROLE_STORAGE_KEY, q);
    }
    setRole(storedDemoRole());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !role || isConnected) return;
    const target = connectors.find((c) => c.id === `demo-${role}`);
    if (target) connect({ connector: target });
  }, [ready, role, isConnected, connectors, connect]);

  const { data: balance } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: MockUSDCAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 3000 },
  });

  if (!ready) return <div className="text-sm opacity-50">…</div>;

  if (!role) {
    const pick = (r: DemoRole) => {
      window.sessionStorage.setItem(DEMO_ROLE_STORAGE_KEY, r);
      setRole(r);
    };
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => pick("client")}
          className="px-3 py-1.5 rounded-md border border-sky-400/40 bg-sky-500/10 text-sky-300 text-sm"
        >
          Connect as Client
        </button>
        <button
          onClick={() => pick("freelancer")}
          className="px-3 py-1.5 rounded-md border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 text-sm"
        >
          Connect as Freelancer
        </button>
      </div>
    );
  }

  const isClient = role === "client";
  return (
    <div className="flex items-center gap-3">
      <span
        className={`px-2.5 py-1 rounded-md border text-xs font-bold tracking-widest ${
          isClient
            ? "border-sky-400/40 bg-sky-500/15 text-sky-300"
            : "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
        }`}
      >
        {isClient ? "CLIENT" : "FREELANCER"}
      </span>
      <div className="text-right leading-tight">
        <div className="font-semibold tabular-nums">
          {fromUsdc(balance as bigint | undefined)}{" "}
          <span className="text-xs font-normal opacity-60">mUSDC</span>
        </div>
        <div className="text-xs opacity-50 font-mono">
          {address ? shortAddr(address) : "connecting…"}
        </div>
      </div>
    </div>
  );
}
