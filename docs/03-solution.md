# 03 — Proposed Solution

> **Source:** Full white paper §3 (Proposed Solution Overview), §4 (Stakeholders & Use Cases); Short white paper "The Solution".
> **Used by:** Slide 3 (Solution), Slide 7 (Demo) narration, MVP web-UI design.
> **See also:** `01-overview.md`, `05-architecture.md`, `06-smart-contract.md`, `11-mvp-scope.md`.

## What it is — at the right level

TrustPay Escrow is **a complete web platform connected to an EVM-compatible smart-contract escrow system** — not merely a smart contract. The contract is the load-bearing trust mechanism; the platform is everything around it that makes blockchain usable.

## End-to-end user flow (5 steps)

1. **Create.** Client creates an escrow agreement, selecting the counterparty, the stablecoin, and a list of milestones with amounts and deadlines.
2. **Deposit.** Client deposits the total amount; the smart contract locks the funds. The freelancer independently verifies on-chain that the funds exist and are locked before doing any work.
3. **Submit.** Freelancer completes a milestone and submits it, attaching deliverables off-chain with a **content hash recorded on-chain**.
4. **Approve.** Client reviews and either approves the milestone — triggering an automatic release of that milestone's amount — or requests changes / opens a dispute.
5. **Dispute (only if needed).** If a dispute is opened, the disputed portion stays locked while the dispute workflow (`07-security-dispute.md`) determines whether to pay the freelancer, refund the client, or split the funds.

Figure: `assets/figures/01-escrow-flow.png`.

## What the platform abstracts away

Blockchain UX is a real adoption barrier, so the platform deliberately hides complexity:
- **Guided wallet connection** — non-crypto users walk through wallet setup once.
- **Plain-language contract statuses** — "Funds locked", "Awaiting your approval", "In dispute" instead of raw state enums.
- **Gas cost preview** — estimated and explained before any signature.
- **Business dashboards** — invoices and reporting for companies, instead of raw transaction hashes.
- **No custom chain** — deploys on an existing L2; the platform does not operate its own blockchain.

## Stakeholders (6 entities)

| Entity | Incentive | Responsibility / on-chain role |
|---|---|---|
| **Client (payer)** | Protection against non-delivery; funds released only after approval. | Signs the deposit and approval transactions. One per base contract. |
| **Freelancer (payee)** | Verifiable proof that funds exist before work starts; no chargeback risk. | Signs milestone-submission transactions. One per base contract. |
| **Escrow smart contract** | None — autonomous agent executing fixed rules. | Holds locked funds, enforces state transitions and access control. |
| **Arbitrator** | Earns a share of dispute fees for ruling fairly and promptly. | Signs `resolveDispute` transactions. Platform moderator (v1) or decentralized panel (later). |
| **Stablecoin issuer** | Maintains the fiat peg and the value of its token. | Operates the ERC-20 (e.g. Circle/USDC, Tether/USDT). External party. |
| **Network validators** | Block rewards / fees of the underlying chain. | Validate and finalize all escrow transactions. The platform runs no chain of its own. |

— Full white paper Table 2.

### Who signs transactions vs who only consumes services

- **Sign on-chain:** client, freelancer, arbitrator.
- **Participate independently of the platform:** stablecoin issuer, validators.
- **Off-chain only:** the platform itself (web app, indexer, database, support). The platform may hold a limited administrative key (multisig — see `07-security-dispute.md`) **but it cannot unilaterally move escrowed funds.**

## Three representative use cases

### Use case A — Normal milestone delivery (expected majority path)

A startup hires a developer for a three-milestone project. Funds for all three milestones are deposited at creation. The developer submits milestone one; the client approves; the contract releases milestone one's amount automatically. The cycle repeats. No dispute is ever opened.

### Use case B — Late delivery and refund

A freelancer misses a milestone deadline and stops responding. After the deadline passes, the client triggers the **deadline-refund path** for the unfunded or unsubmitted milestone, recovering the locked amount. Already-approved milestones remain paid.

### Use case C — Disputed delivery

A freelancer submits a milestone and marks it complete; the client rejects it as not matching the agreed scope. The client opens a dispute, paying a dispute fee and submitting evidence. The disputed amount stays locked. An arbitrator reviews evidence from both sides and rules — pay, refund, or split. The contract executes the verdict.

## High-level component view (referenced in detail in `05-architecture.md`)

Five blocks: web application; backend / API and off-chain database; wallet and stablecoin layer; escrow smart contracts; indexer / off-chain storage.

## Slide-ready hooks

- "Lock funds → deliver milestone → release payment."
- "The freelancer can verify on-chain that the money exists **before starting any work**."
- "Release happens only on milestone approval — neither side goes first."
- "Once a payment is released on-chain it **cannot be silently reversed**."
- "We hide blockchain behind statuses you already understand: *Funds locked. Awaiting your approval. In dispute.*"
