import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ConnectBar } from "@/components/ConnectBar";

export const metadata: Metadata = {
  title: "TrustPay Escrow",
  description: "Stablecoin smart-contract escrow for cross-border freelance work",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <header className="border-b border-white/10">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
              <a href="/" className="font-semibold tracking-tight">
                TrustPay <span className="text-brand opacity-90">Escrow</span>
              </a>
              <ConnectBar />
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
          <footer className="max-w-5xl mx-auto px-6 py-8 text-xs opacity-60">
            INE5458 / UFSC — testnet demo only. Mock USDC is not real money.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
