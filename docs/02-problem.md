# 02 — Problem Definition

> **Source:** Full white paper §1.1–1.2, §2; Short white paper "The Problem".
> **Used by:** Slide 2 (Problem), Video opener (~90s).
> **See also:** `01-overview.md`, `04-why-blockchain.md`.

## The problem in one paragraph

International freelance work is genuinely global — a designer in Brazil hired by a startup in Germany, a developer in Vietnam by a Canadian agency. But the two parties usually do not know each other, may never have spoken before the contract, are subject to different legal systems, and carry **asymmetric risk**. A client who pays in advance can lose the money if work never arrives. A freelancer who delivers first can lose weeks of labor if the client refuses to pay — or files a chargeback months later. Cross-border bank transfers, card payments, and money-transfer services are slow, layered with fees, and difficult to reconcile. The market runs on uneasy trust.

## Four dimensions of the problem

1. **Trust.** Zero prior relationship, no shared legal forum. Each must extend credit — of money or of labor — to a stranger.
2. **Settlement.** Cross-border bank transfers and card payments are slow (days to clear), expensive (FX spreads + fixed and percentage fees), and prone to **reversal or chargeback** long after the work is done.
3. **Transparency.** On a centralized platform, neither party can independently verify that funds are held, untouched, and available. The custody ledger is **private and discretionary**.
4. **Dispute handling.** When parties disagree about whether work was completed, resolution is opaque, slow, and final at the discretion of an intermediary with its own incentives.

## Why existing solutions are incomplete

Centralized freelance marketplaces solve part of this by holding the client's payment and releasing it on completion. **This works, but it relocates rather than removes the trust problem:** users must now trust the platform as the sole custodian of their funds and the sole, opaque judge of their disputes. A user cannot independently verify that deposited funds still exist, are not commingled, or are not frozen for reasons unrelated to the contract. Fees are set unilaterally. Withdrawals can be delayed or blocked. The escrow is real, but it is *invisible* and *discretionary*.

## The problem is behavioral, not only technical

This is fundamentally a **coordination problem under uncertainty**. Each party would rationally prefer the other to commit first. In game-theoretic terms, advance payment and delivery-before-payment are both **unstable equilibria** for the disadvantaged side. The function of an escrow is to remove the ordering problem: both commitments become simultaneous and conditional.

Blockchain becomes relevant precisely because it can make that conditional commitment **verifiable by both parties without a trusted third party holding the money**.

## Problem map (table)

| Actor | Core fear | Current workaround | Remaining limitation |
|---|---|---|---|
| **Client** | Pays in advance; work never delivered. | Use a centralized platform that holds funds. | Must trust the platform as opaque custodian and judge. |
| **Freelancer** | Delivers work; payment never arrives or is reversed. | Ask for partial up-front payment; rely on reviews. | Up-front shifts risk to client; chargebacks still possible. |
| **Both** | Slow, costly, hard-to-track settlement. | International transfer or card payment. | FX spreads, fees, multi-day delays, reconciliation effort. |
| **Both** | Disagreement over completion. | Platform support ticket / informal negotiation. | Opaque decision; no neutral, verifiable record of approvals. |

— Full white paper Table 1.

## Slide-ready hooks

- "Two strangers, two countries, two legal systems — **someone always has to go first**."
- "If the client pays first, work may never arrive. If the freelancer delivers first, payment may never come — or be reversed later as a chargeback."
- "Centralized platforms do hold the money — but they only **relocate trust** to a private company users cannot audit."
- "The escrow exists. It is just **invisible and discretionary**."
