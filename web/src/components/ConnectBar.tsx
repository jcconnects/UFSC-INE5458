"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectBar() {
  return <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />;
}
