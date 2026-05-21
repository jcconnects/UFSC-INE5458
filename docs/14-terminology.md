# 14 — Terminology

> **Source:** Full white paper Appendix B.
> **Used by:** Consistency check across all docs; anchor for any new content.
> **See also:** all `0N-*.md` files.

Use these terms exactly. Do not invent synonyms. If you need a new term, add it here first.

| Term | Definition |
|---|---|
| **Client** | The payer; the party that funds the escrow and approves milestones. |
| **Freelancer** | The payee; the party that performs the work and submits milestones. |
| **Escrow** | The smart contract that holds locked funds and enforces release rules. |
| **EscrowFactory** | The single platform-wide contract that deploys Escrow instances and holds platform parameters (fee, allowlist, arbitrators). |
| **Milestone** | A defined unit of work with its own amount, deadline, and state. |
| **Locked funds** | Stablecoin held by the contract and not releasable until conditions are met. |
| **Approval / Release** | Client confirmation of a milestone, and the resulting transfer to the freelancer. |
| **Refund** | Return of locked funds to the client after a deadline or dispute verdict. |
| **Dispute** | A contested milestone whose funds remain locked until an arbitrator rules. |
| **Arbitrator** | The human or decentralized party that rules on a dispute. |
| **Verdict** | One of `pay`, `refund`, or `split` returned by the arbitrator and executed by the contract. |
| **Stablecoin** | A fiat-pegged ERC-20 token (e.g. USDC, USDT) used for settlement. |
| **On-chain / Off-chain** | Data stored on the blockchain versus data stored in conventional systems. |
| **Event indexer** | A service that turns on-chain event logs into fast, queryable off-chain data. |
| **Wallet integration** | The connection between a user's self-custody wallet and the platform. |
| **Mock USDC** | A test ERC-20 used in the MVP demo. Has a public `mint` for funding demo wallets. |
| **Hybrid architecture** | The design where financial state lives on-chain and operational data lives off-chain. |
| **Multisig admin** | The 3-of-5 administrative role for platform-wide config — bounded by timelock and scoped never to touch individual escrows. |
| **Timelock** | The 48-hour delay between proposing and executing any non-emergency admin action. |

— Full white paper Table B1, extended with two MVP-specific terms (mock USDC, multisig admin) for completeness.
