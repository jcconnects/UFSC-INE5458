"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DEMO_MODE } from "@/lib/wagmi";
import { DemoBar } from "./DemoBar";

export function ConnectBar() {
  if (DEMO_MODE) return <DemoBar />;
  return <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />;
}
