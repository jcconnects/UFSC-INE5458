# 09 — Business Model and Go-to-Market

> **Source:** Full white paper §12 (Innovation), §13 (Business Model and GTM); Short white paper "Business Model".
> **Used by:** Slide 8 (Business Model).
> **See also:** `01-overview.md`, `04-why-blockchain.md`.

## Innovation framing (verbatim — guard against drift)

> The innovation here is **not** simply accepting cryptocurrency payments. It is the combination of **stablecoin settlement, milestone-based escrow, a verifiable contract state, and a dispute workflow** designed specifically for small cross-border service contracts.
> — Full white paper §12

## Positioning vs each alternative

### vs ordinary crypto transfers
A direct wallet-to-wallet stablecoin transfer is fast and cheap but **protects neither party** — exactly as risky as a bank transfer with no recourse. TrustPay Escrow adds the conditional, milestone-bound custody that a raw transfer lacks.

### vs centralized freelance platforms
A centralized platform's interface helps users; ours does too. But on a centralized platform the fund state is enforced by a **private, opaque ledger**. Here it is enforced **transparently** by smart contracts the parties can audit. The platform is a **facilitator, not a custodian**.

### vs banks and payment processors
Banks and processors are not programmable and not cross-border by design; escrow, where it exists, is a manual, jurisdiction-bound service. TrustPay Escrow's escrow logic is **programmable and cross-border by default**, and fees are collected transparently in stablecoin at the moment of release.

### Two-axis positioning map
- X-axis: platform control (low → high)
- Y-axis: custody transparency (low → high)

- **Banks / centralized platforms** → high control, low transparency.
- **Raw crypto transfers** → low control, low protection.
- **TrustPay Escrow** → **high transparency**, with only the minimum necessary platform control. (Until decentralized arbitration is integrated, dispute resolution keeps us from claiming the extreme low-control corner — be honest about it.)

## Revenue streams

| Stream | Mechanism | Notes |
|---|---|---|
| **Transaction fee** | ~**0.5–1.5%** per completed escrow, collected automatically in stablecoin at release. | Transparent and embedded in the contract — no separate billing infrastructure. |
| **Business subscription** | Paid tier for businesses: team accounts, advanced reporting, priority support, SLA. | Targets startups / small businesses / agencies. |
| **Dispute resolution fees** | Premium arbitration fees shared with arbitrators. | Aligns arbitrator incentives toward fair, timely rulings. |

## Why the technical design supports the business

Because the escrow contract **already mediates every release**, the platform fee can be deducted at exactly that point — collected automatically, transparently, and in stablecoin, **with no separate billing system and no intermediary**. Business accounts are simply richer off-chain dashboards over the same on-chain escrows.

**The fee logic is a few lines in a contract that already exists for custody reasons.** This is the alignment hook.

## Cost structure (non-negotiable line items first)

- **Security audits** — recurring, treated as non-negotiable.
- **Compliance** — non-negotiable.
- Engineering salaries.
- Cloud / node infrastructure (RPC providers, indexer hosting).
- Smart-contract development.
- Marketing and growth.
- User support.

Audits and compliance are first-class costs because the protocol custodies user funds.

## Channels and customer acquisition

- **The web platform** itself.
- **Crypto wallet integrations** (MetaMask, WalletConnect, Coinbase Wallet, etc.).
- **Fiat on/off-ramp partnerships** so users can enter and exit without deep crypto knowledge.
- **Communities** of international freelancers, startups, small businesses, agencies, remote-work platforms.
- **Educational content** explaining stablecoin payments to a non-crypto audience.

## Target customer recap

1. International freelancers.
2. Startups and small businesses hiring globally.
3. Small agencies.

(See `01-overview.md` and `03-solution.md` for the full framing.)

## Slide-ready hooks

- "**0.5–1.5%** per completed escrow. Collected automatically in stablecoin at release."
- "The fee is **a few lines in a contract that already exists** for custody reasons."
- "The platform is a **facilitator, not a custodian.**"
- "Audits and compliance are not line items we will cut."
