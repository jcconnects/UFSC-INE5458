"use client";

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { EscrowAbi } from "@/lib/abis/Escrow";
import { escrowStatusLabel, fromUsdc, shortAddr } from "@/lib/format";
import { DepositPanel } from "./DepositPanel";
import { MilestoneList, Milestone } from "./MilestoneList";
import { ExplorerLink } from "./ExplorerLink";

export function EscrowView({ escrow }: { escrow: `0x${string}` }) {
  const { address } = useAccount();

  const summaryRead = useReadContract({
    address: escrow,
    abi: EscrowAbi,
    functionName: "summary",
    query: { refetchInterval: 5000 },
  });

  const milestonesRead = useReadContracts({
    contracts: [
      { address: escrow, abi: EscrowAbi, functionName: "getMilestones" },
    ],
    query: { refetchInterval: 5000 },
  });

  const refetchAll = () => {
    summaryRead.refetch();
    milestonesRead.refetch();
  };

  if (summaryRead.isLoading || milestonesRead.isLoading) {
    return <div className="opacity-70">Loading escrow…</div>;
  }
  if (!summaryRead.data) {
    return <div className="text-red-300">Could not load escrow at {escrow}.</div>;
  }

  const [client, freelancer, token, deposited, status, milestoneCount] = summaryRead.data as [
    `0x${string}`,
    `0x${string}`,
    `0x${string}`,
    bigint,
    number,
    bigint,
  ];
  const milestones = (milestonesRead.data?.[0]?.result as Milestone[] | undefined) ?? [];

  const isClient = address?.toLowerCase() === client.toLowerCase();
  const isFreelancer = address?.toLowerCase() === freelancer.toLowerCase();
  const role = isClient ? "Client view" : isFreelancer ? "Freelancer view" : "Observer view";

  const total = milestones.reduce((s, m) => s + m.amount, 0n);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div className="text-xs uppercase opacity-60 tracking-wider">{role}</div>
        <h1 className="text-3xl font-semibold tracking-tight">Escrow</h1>
        <div className="text-sm opacity-80">
          <ExplorerLink address={escrow} label={shortAddr(escrow)} />
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-3">
        <Stat label="Status" value={escrowStatusLabel[status]} />
        <Stat label="Locked" value={`${fromUsdc(deposited)} mUSDC`} />
        <Stat label="Milestones" value={String(milestoneCount)} />
      </section>

      <section className="grid sm:grid-cols-2 gap-3">
        <Card label="Client">
          <ExplorerLink address={client} label={shortAddr(client)} />
        </Card>
        <Card label="Freelancer">
          <ExplorerLink address={freelancer} label={shortAddr(freelancer)} />
        </Card>
      </section>

      <section className="text-xs opacity-60">
        Token:&nbsp;<ExplorerLink address={token} label={shortAddr(token)} />
      </section>

      {status === 0 && (
        <DepositPanel escrow={escrow} client={client} total={total} onDeposited={refetchAll} />
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Milestones</h2>
        <MilestoneList
          escrow={escrow}
          client={client}
          freelancer={freelancer}
          milestones={milestones}
          onMutated={refetchAll}
        />
      </section>

      {!isClient && !isFreelancer && (
        <div className="text-sm opacity-70">
          You are not a party to this escrow — you can read everything but no actions are available.
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 p-4">
      <div className="text-xs uppercase opacity-60 tracking-wider">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 p-4">
      <div className="text-xs uppercase opacity-60 tracking-wider">{label}</div>
      <div className="font-medium">{children}</div>
    </div>
  );
}
