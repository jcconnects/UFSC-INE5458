# 10 — Roadmap and Honest Limitations

> **Source:** Full white paper §14.1 (Roadmap), §14.2 (Limitations); Short white paper "Roadmap".
> **Used by:** Slide 9 (Roadmap), Slide 10 (Limitations + Close), Q&A.
> **See also:** `11-mvp-scope.md`, `07-security-dispute.md`.

## Roadmap principle

Development is staged so each phase **depends on the verified success of the previous one** — a deliberately dependency-driven plan. No phase is shipped before the prior one is validated.

Figure: `assets/figures/05-roadmap.png`.

## Five phases

### Phase 1 — Proof of concept
- Testnet escrow contract.
- Basic web interface.
- **Complete flow from deposit to milestone release.**

### Phase 2 — MVP / pilot
- Deployment on a low-cost L2 with **real stablecoin support**.
- **Event indexer**.
- **Platform-managed dispute resolution**.

### Phase 3 — Business tier
- Team accounts.
- Invoices, reporting.
- **Fiat on/off-ramp partnerships**.

### Phase 4 — Hybrid arbitration
- Integration of a **decentralized arbitration protocol** (e.g. Kleros) alongside platform moderation.

### Phase 5 — Scale
- **Multi-chain** or cross-chain support.
- Broader stablecoin coverage.

## What this project will deliver right now

For the INE5458 deliverable, we ship the demonstrable core of **Phase 1 + the beginning of Phase 2**:
- Solidity Escrow contract on EVM testnet.
- Minimal Next.js web UI with wallet connect.
- End-to-end happy path: create → deposit → submit → approve → release.
- Mock USDC (test ERC-20 minted to demo wallets).
- Dispute path **implemented in the contract** but **not demoed live** (narrated only).

See `11-mvp-scope.md` for the precise cut.

## Honest limitations (Full §14.2)

Credibility requires stating what remains unsolved:

- **Legal / regulatory variance.** Conditions vary by country and are still evolving.
- **Stablecoin risk.** A de-peg or issuer freeze would affect locked value.
- **Subjective quality.** The protocol cannot evaluate work quality; that always requires a human arbitrator.
- **Smart-contract bugs.** Possible despite audits.
- **Non-crypto onboarding friction.** Genuine; good product design reduces it but cannot eliminate it.

Each limitation maps to a mitigation in `07-security-dispute.md` (security, dispute) and to the roadmap (e.g. fiat ramps in Phase 3, decentralized arbitration in Phase 4). **None is hidden.**

## Conclusion (verbatim, for Slide 10)

> "TrustPay Escrow applies blockchain **exactly where it adds value and nowhere else**. Blockchain provides what the use case genuinely needs — verifiable custody, transparent state, and programmable release between parties with zero prior trust — while off-chain systems handle usability, private data, and file storage, which they do better. The protocol is feasible with present-day infrastructure: audited token standards, EVM-compatible Layer 2 networks, mature wallet tooling, and established indexing services. **It requires no new blockchain and no speculative technology.**"
> — Full white paper §14.3

> "The central thesis stands: a stablecoin smart-contract escrow can meaningfully reduce the trust and settlement friction of international freelance work by locking funds transparently and releasing them through programmable milestone rules."
> — Full white paper §14.3

## Slide-ready hooks

- "Each phase depends on the verified success of the previous one."
- "Phase 1 → testnet. Phase 2 → real stablecoins. Phase 3 → fiat ramps. Phase 4 → decentralized arbitration. Phase 5 → multi-chain."
- "Buildable today. **No new chain. No speculative technology.**"
