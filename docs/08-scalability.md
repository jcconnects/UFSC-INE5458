# 08 — Scalability, Infrastructure, and Performance

> **Source:** Full white paper §11 (Scalability, Infrastructure, and Performance).
> **Used by:** Reference; one supporting bullet on Slide 5 or 9; Q&A on "does this scale?".
> **See also:** `05-architecture.md`.

## Top-line claim

The platform **does not require its own blockchain**. It deploys on an EVM-compatible Layer 2 with low transaction costs and stablecoin support. This reduces development complexity while preserving the security and transparency of smart contracts.

## Why a Layer 2 (three concrete reasons)

1. **Low fees** — paying a fee per milestone does not erode small contracts.
2. **Fast confirmation** — responsive user experience.
3. **Mature ecosystem** — wallet tooling, stablecoin deployments, and indexers already exist on major L2s; no custom infrastructure needed.

Building a dedicated chain would add enormous cost and security burden for no proportionate benefit.

## Where the real scaling challenge lives

Each escrow produces only a small, bounded number of transactions — deposit, a few submissions and approvals, perhaps a dispute. The system is **not** computation-heavy.

**The actual scaling challenge is a high number of concurrent escrows** generating events, plus the indexing, notification, and dashboard-query load that comes with many simultaneous users. That load is an **off-chain engineering problem**, solved with standard techniques (caching, queueing, horizontal scaling of the indexer/API).

## Blockchain latency vs application latency

These must not be confused. Blockchain confirmation has inherent latency; the web application does **not** have to inherit it.

- Show explicit pending-transaction states ("Deposit confirming...").
- Update optimistically once a transaction is broadcast.
- Confirm when the event is indexed.

The perceived experience stays smooth even when on-chain finality takes seconds.

## Indexing and caching

Users never query the blockchain directly for routine screens.
- The event indexer maintains an off-chain projection of all escrow state.
- Dashboards and notifications read from that cached projection.
- Direct chain reads are reserved for moments a user explicitly wants to verify state independently.
- Off-chain file storage further reduces cost and protects privacy.

## Performance assumptions

| Operation | On-chain tx count | Expected bottleneck |
|---|---|---|
| Create + fund an escrow | 2 (+1 token approval) | L2 confirmation time; mitigated by pending-state UI. |
| Submit + approve a milestone | 2 | None significant at expected volumes. |
| Release a payment | 1 | Token transfer cost; negligible on an L2. |
| Open + resolve a dispute | 2 | **Human arbitration time**, not on-chain throughput. |
| Render dashboards (many users) | 0 (indexed reads) | Indexer throughput and database query load. |

— Full white paper Table 8.

**The dominant cost is off-chain indexing, not on-chain computation.**

## Slide-ready hooks

- "**No new chain.** Deploy on an existing L2."
- "Each escrow is a few transactions. Scaling = serving many escrows, not heavy compute."
- "Blockchain has latency. The UI doesn't have to."
