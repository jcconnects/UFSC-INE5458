# 05 — Technical Architecture

> **Source:** Full white paper §6 (Technical Architecture), §8 (Data Model and Processing).
> **Used by:** Slide 5 (Architecture), MVP web-UI scaffolding decisions.
> **See also:** `06-smart-contract.md`, `08-scalability.md`, `11-mvp-scope.md`.

## Design principle

The system uses a **hybrid architecture**. Financial commitments and state transitions that must be auditable live **on-chain**; everything else — large files, profiles, messages, identity data — lives **off-chain** for cost, privacy, and scalability.

Figure: `assets/figures/02-architecture.png`.

## Four layers

### 1. On-chain layer
Stores only what must be auditable: escrow creation, deposits, milestone amounts, approvals, releases, refund decisions, dispute verdicts.
Components: escrow smart contracts (`06-smart-contract.md`), the external stablecoin ERC-20 contract, optional oracle for time-based unlocks.
Deployed on an **EVM-compatible Layer 2**. The protocol never operates its own blockchain.

### 2. Off-chain layer
User profiles, business metadata, in-app messages, KYC data where required, deliverable files.
Why off-chain: putting any of this on-chain would be prohibitively expensive, would permanently expose private data, and would not benefit from on-chain immutability. When a deliverable must be verifiable, **the file stays off-chain and only its cryptographic hash or IPFS CID is anchored on-chain.**

### 3. Application layer (backend / API)
- REST/GraphQL API.
- Off-chain database (profiles, metadata, indexed event projections).
- **Event indexer** — transforms raw on-chain logs into fast queries for dashboards and notifications.
- Without an indexer, every dashboard screen would require slow, repeated direct calls to the blockchain. Critical for UX.

### 4. Presentation layer (web app)
Connects users to the escrow contracts through wallet integrations and renders contract events as a readable interface.

## On-chain vs off-chain data classification

| Data | Location | Why |
|---|---|---|
| Contract state, milestone status | **On-chain** | Determines fund custody; must be tamper-proof and auditable. |
| Locked amounts, approvals, dispute verdicts | **On-chain** | Directly control who receives money; cannot be discretionary. |
| Deliverable file hash / IPFS CID | **On-chain (hash only)** | Proves the file was not altered without storing the file itself. |
| Deliverable files, milestone descriptions | **Off-chain** | Too large and costly for on-chain storage. |
| Chat messages, support tickets | **Off-chain** | Operational data; no custody impact; immutability not desired. |
| User profiles, KYC / identity data | **Off-chain** | Private personal data must never be public or permanent. |

— Full white paper Table 6.

## Suggested technology stack

| Layer | Suggested technology | Why this choice |
|---|---|---|
| Smart contracts | **Solidity** on an EVM-compatible L2 | Largest auditor pool, mature tooling, audited token standards reduce security risk. |
| Frontend | **React / Next.js** | Server-side rendering for fast load; rich wallet-connector libraries available. |
| Backend / API | **Node.js / NestJS** | Shares the JavaScript/TypeScript toolchain with the frontend and Ethereum libraries. |
| Off-chain database | **PostgreSQL** | Reliable relational store for profiles, metadata, and indexed event projections. |
| File storage | **IPFS** or object storage | Content-addressed storage; the on-chain hash proves a file was not altered. |
| Event indexing | **The Graph** or a custom indexer | Converts contract logs into queryable data so the UI never polls the chain directly. |
| Chain access | **ethers.js / viem** + RPC provider | Standard libraries for signing transactions and subscribing to events. |

— Full white paper Table 4.

## Canonical data flow

```
create escrow → deposit → submit deliverable → approve or reject → release or refund
```

Each step is a transaction that emits an event. The indexer consumes the event, updates the off-chain projection, and the backend sends notifications. The UI stays responsive while reflecting authoritative on-chain state.

## Inputs and outputs

- **On-chain inputs:** client and freelancer addresses, token address, milestone amounts and identifiers, approval or rejection signals, dispute verdict.
- **On-chain outputs:** emitted events, state changes, stablecoin transfers.
- **Off-chain inputs:** deliverable files, milestone descriptions, in-app messages, identity data, support tickets.
- **Off-chain outputs:** dashboard projections, notifications, invoices, reports.

## Processing model — critical security property

**The backend never computes custody decisions.** The smart contract executes the escrow rules — milestone checks, access control, fund routing — as deterministic computation verified by network consensus. The backend listens to emitted events, updates dashboards, sends notifications, and manages off-chain records. An optional oracle (e.g. Chainlink) can supply real-world data such as time-based unlock for automatic deadline actions.

**Consequence:** a bug in the off-chain code can never misdirect escrowed funds.

## Slide-ready hooks

- "Hybrid by design — **on-chain for trust, off-chain for everything else.**"
- "Files stay off-chain. Only their hashes are anchored on-chain."
- "The backend **never** decides where money goes. The contract does."
