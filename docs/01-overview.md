# 01 — Overview

> **Source:** Short white paper (all); Full §1 (Introduction), §3 (Proposed Solution Overview), §14.3 (Conclusion).
> **Used by:** Slide 1 (Title), Slide 3 (Solution), Video opener and close, delivery README.
> **See also:** `04-why-blockchain.md`, `11-mvp-scope.md`.

## What it is, in one sentence

**TrustPay Escrow** is a web platform that locks payment in a **stablecoin smart-contract escrow** until work is delivered, so neither freelancer nor client must trust the other or a private custodian.

## Thesis (verbatim — do not paraphrase)

> "A stablecoin smart-contract escrow can reduce the trust and settlement problems of cross-border freelance work by locking funds transparently and releasing them through programmable milestone rules."
> — Full white paper §1.3

## Who it is for

In order of priority:
1. Independent international freelancers and remote contractors.
2. Small businesses and startups hiring talent globally.
3. Small agencies that coordinate several contractors.

Common denominator: recurring need to pay or be paid **across borders** for **milestone-based service work** (software, design, marketing, consulting, translation, remote operations) in amounts large enough to matter but too small to justify lawyers or letters of credit.

## How it works in three steps

1. **Lock funds.** Client deposits the full project amount in USDC/USDT into the escrow smart contract. Freelancer can independently verify on-chain that the money is there before starting any work.
2. **Deliver milestone.** Freelancer submits a milestone with a deliverable hash recorded on-chain. Files themselves stay off-chain.
3. **Release payment.** Client approves; the contract automatically transfers that milestone's stablecoin amount (minus a small platform fee) to the freelancer. No private party can secretly redirect the funds.

See `assets/figures/01-escrow-flow.png`.

## What changes vs the alternatives

| Property | Bank / card | Centralized freelance platform | TrustPay Escrow |
|---|---|---|---|
| Funds held conditionally | No | Yes | Yes |
| Both parties verify the money | No | No (private ledger) | Yes (on-chain) |
| Release rules programmable | No | Partial / opaque | Yes |
| Chargeback / silent reversal | High | Medium | None on-chain |
| Trust in a private custodian | Bank | Platform | None for custody |

## What blockchain adds (and what it does NOT)

**Adds:** verifiable conditional custody, transparent state, programmable release, no single custodian. (See `04-why-blockchain.md` for the full argument.)

**Does NOT** (Full §5.3, stated honestly):
- Verify real-world identity of the parties → handled off-chain via optional KYC.
- Enforce legal judgments in any national court → handled by terms of service.
- Evaluate whether delivered work is "good" → handled by the human arbitration layer (`07-security-dispute.md`).

## Innovation framing (verbatim)

> The innovation here is **not** simply accepting cryptocurrency payments. It is the combination of stablecoin settlement, milestone-based escrow, a verifiable contract state, and a dispute workflow built specifically for small cross-border service contracts.
> — Full white paper §12

## Closing line (verbatim)

> "TrustPay Escrow applies blockchain exactly where it adds value and nowhere else."
> — Full white paper §14.3

## Quick facts for slides and pitch

- Built on existing **EVM-compatible Layer 2** networks; no new chain.
- Settled in **regulated stablecoins** (USDC, USDT) — zero crypto-volatility exposure.
- Wallet complexity is hidden behind guided onboarding and plain-language statuses ("Funds locked", "Awaiting your approval", "In dispute").
- Platform fee ~0.5–1.5% per completed escrow, collected automatically in stablecoin at release.
- The protocol is a **living document** (Ethereum white paper-style); the design is testable and revisable from pilot feedback.
