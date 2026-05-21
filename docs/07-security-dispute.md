# 07 — Security Model and Dispute Resolution

> **Source:** Full white paper §9 (Security Model and Risk Controls), §10 (Dispute Resolution Mechanism).
> **Used by:** Q&A defense, "honesty" bullets in Slides 4 & 6, Slide 10 (Limitations).
> **See also:** `04-why-blockchain.md`, `06-smart-contract.md`.

## Three families of risk

1. **Smart-contract risks** — bugs in the code that custodies the funds.
2. **User risks** — losses the contract cannot prevent (lost keys, phishing).
3. **Business / legal risks** — stablecoin availability, regulation, chargeback exposure on fiat ramps.

## Smart-contract risks and mitigations

| Risk | Mitigation |
|---|---|
| Logic bugs | Keep first version small and simple; independent audits; testnet pilot; bug bounty. |
| **Reentrancy** on token transfer | Checks-effects-interactions pattern + explicit `ReentrancyGuard`. |
| Incorrect access control | Strict `msg.sender` + state checks on every function. |
| Funds permanently stuck | Conservative state machine; only legal transitions allowed. |
| Non-standard ERC-20 (fee-on-transfer, etc.) | **Short audited allowlist** of supported stablecoins, enforced at factory. |

## User risks and mitigations

Users can lose funds in ways the contract cannot prevent: sending to a wrong wallet, falling for phishing sites, misunderstanding gas fees, losing private keys.

Product mitigations:
- Guided onboarding.
- Explicit confirmation screens before every signature.
- Prominently displayed, verifiable contract addresses.
- Plain-language warnings.

**But:** self-custody carries irreducible user responsibility. The white paper states this explicitly.

## Business and legal risks

- Stablecoin availability varies by jurisdiction.
- Compliance obligations evolve.
- Disputes can themselves become legitimacy questions.
- Chargeback exposure exists on the **fiat on-ramp side**, before value becomes stablecoin.

Mitigations: staged geographic rollout; conservative compliance posture; clear terms of service.

## Risk matrix

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Smart-contract bug | High | Medium | Independent audits, testnet pilot, bug bounty, minimal logic. |
| Reentrancy on transfer | High | Low | Checks-effects-interactions + reentrancy guard. |
| Wrong / non-standard token | Medium | Low | Short audited allowlist enforced by the factory. |
| User key loss / phishing | High | Medium | Guided onboarding, signature confirmations, verified addresses. |
| Stablecoin de-peg / freeze | High | Low | Support multiple issuers; monitor peg; clear user disclosure. |
| Regulatory / compliance change | High | Medium | Staged rollout by jurisdiction; conservative compliance. |
| Admin-key compromise | High | Low | **Multisig admin (3-of-5)**; tightly scoped, transparent admin powers. |

— Full white paper Table 7.

## Administrative powers — the residual trust assumption

Admin capabilities exist for genuine operational needs:
- Pause **new** escrow creation in an emergency.
- Update the supported-token allowlist as new audited stablecoins emerge.
- Adjust the platform fee within its hard-coded maximum.
- Rotate the fee receiver address.

**These powers are held by a 3-of-5 multisig**, never a single key. Five signers from independent roles (founding team, legal counsel, external advisor, security partner, dedicated cold-storage ops key) so no single individual or organizational faction can act unilaterally.

### Two further bounds on admin power

1. **Scope limitation.** The admin role can **never** seize, redirect, freeze, or modify the balance of any individual escrow. Funds already locked in an Escrow instance are governed exclusively by that instance's deployed code and the signatures of its client, freelancer, and assigned arbitrator. **There is no admin function that takes an escrow address as a parameter.**
2. **Timelock.** All non-emergency admin actions are subject to a **48-hour on-chain timelock** between proposal and execution. The proposed action is publicly visible; users can settle and withdraw from active escrows before any change takes effect. The emergency pause is exempt from the timelock but can only stop **new** escrow creation; it cannot affect existing escrows.

### Upgrade policy

- Individual Escrow instances are **non-upgradeable**, proxy-less contracts → users' locked funds are governed by exactly the bytecode they agreed to.
- EscrowFactory is upgradeable via the same multisig + timelock process, but **factory upgrades affect only escrows created after the upgrade — never retroactively.**

The admin role is treated as a careful operator of shared infrastructure, **not** as a custodian of user funds. This is the residual trust assumption the protocol does not fully eliminate — and it is acknowledged honestly.

---

## Dispute Resolution Mechanism

Not every freelance deliverable can be judged by code — a contract cannot decide whether a logo is "good". The protocol uses a **hybrid dispute model**: the smart contract enforces that disputed funds stay locked, while the decision itself comes from a human or decentralized arbitration layer.

Figure: `assets/figures/04-dispute-flow.png`.

### Opening a dispute

- Either party may open on a submitted milestone before its approval deadline.
- Opening requires paying a **dispute fee or posting a stake**.
- Evidence is submitted off-chain, referenced by an on-chain hash.
- The fee/stake is partially refundable to the party the arbitrator rules in favor of — to discourage frivolous disputes.

### Resolution outcomes

The arbitrator returns one of three verdicts, which the contract executes:
1. **Pay** the freelancer the full milestone amount.
2. **Refund** the client the full amount.
3. **Split** the funds in a stated proportion.

A fourth optional path — **request rework** — can return the milestone to the freelancer instead of a final verdict.

### Anti-abuse controls

- **Dispute fee / stake** — real cost deters bad-faith filings.
- **Reputation impact** — outcomes feed an off-chain reputation signal visible to future counterparties.
- **Evidence requirement** — a dispute with no submitted evidence can be summarily resolved against the opener.
- **Escalating penalties** — repeated bad-faith disputes from the same account incur progressively larger fees/stakes.

### Evolution: from managed to decentralized arbitration

- **v1** — platform-managed arbitration (trained moderators). Simpler, faster.
- **Later versions** — integration of a decentralized protocol such as **Kleros**, where a randomly selected, economically incentivized juror panel rules. Improves neutrality and scalability.

The protocol is honest that the early system is moderated by the platform; **it does not claim total decentralization it has not yet earned.** In every version, the contract executes the verdict but never judges work quality itself.

## Slide-ready hooks

- "Admin can pause new escrows. **Admin can never touch your locked funds.**"
- "No function takes an escrow address as a parameter — that is the line."
- "**The contract holds the funds. A human decides. The contract executes the verdict.**"
- "v1 — moderators. Later — Kleros. We do not claim decentralization we have not earned."
