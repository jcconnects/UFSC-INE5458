import Link from "next/link";
import { TokenBalance } from "@/components/TokenBalance";
import { EscrowList } from "@/components/EscrowList";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="opacity-70 max-w-2xl">
          Lock funds → deliver milestone → release payment. The freelancer verifies on-chain
          that the money exists <em>before</em> starting any work.
        </p>
      </section>

      <TokenBalance />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your escrows</h2>
          <Link
            href="/create"
            className="px-4 py-2 rounded-md bg-brand text-brand-fg font-medium hover:opacity-90"
          >
            Create escrow
          </Link>
        </div>
        <EscrowList />
      </section>
    </div>
  );
}
