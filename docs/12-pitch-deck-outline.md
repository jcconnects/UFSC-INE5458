# 12 — Pitch Deck Outline (10 slides)

> **Source:** Synthesized from `01`–`11`.
> **Used by:** Slide authoring (any tool — Google Slides, Keynote, Marp, Slidev), Video script anchor (`13-video-script.md`).
> **See also:** All `0N-*.md` files for source material.

## Deck shape

- **10 slides total**, English.
- **Target duration: 10–15 minutes spoken** including a ~3-min live demo on Slide 7.
- Each slide below specifies: **title**, **one-sentence key message**, **bullets** (3–5), **source file** to load when authoring, and **figure** if any.
- Keep each non-demo slide to ≤ 5 bullets and ≤ 25 words per bullet. The point is to support speech, not replace it.

---

## Slide 1 — Title + Team

- **Title (verbatim):** *TrustPay Escrow — A Stablecoin Smart-Contract Escrow for Cross-Border Freelance Work*
- **Key message:** Who we are, what we built, and the course context.
- **Bullets:**
  - INE5458 — Blockchain and Cryptocurrencies Technologies · UFSC
  - Augusto de Hollanda Vieira Guerner · Eduardo Gwoszdz De Lazari · João Pedro Schmidt Cordeiro · Micael Angelo Sabadin Presotto
  - White paper v1.0 — a living document
- **Source:** `01-overview.md`
- **Figure:** none (clean title slide)
- **Speaker time:** ~30s

---

## Slide 2 — The Problem

- **Title:** *Two strangers. Two countries. Someone always has to go first.*
- **Key message:** International freelance payments fail on **trust, settlement, transparency, and dispute** — and existing fixes only relocate the trust problem.
- **Bullets:**
  - Client pays first → work may never arrive.
  - Freelancer delivers first → payment may never come, or get reversed.
  - Centralized platforms hold the money — but they only **relocate trust** to a private custodian users cannot audit.
  - The escrow exists. It is just **invisible and discretionary.**
- **Source:** `02-problem.md` (problem-map table optional inset)
- **Figure:** none, or a 2x2 trust matrix sketch
- **Speaker time:** ~75s

---

## Slide 3 — The Solution

- **Title:** *Lock funds → deliver milestone → release payment.*
- **Key message:** Funds locked in an on-chain escrow before work starts; release happens only on milestone approval; the freelancer can verify the money is there before doing anything.
- **Bullets:**
  - Client deposits **USDC/USDT** into the escrow smart contract.
  - Freelancer verifies **on-chain** that funds are locked. Then works.
  - Client approves → contract releases that milestone automatically.
  - The platform abstracts the wallet — *Funds locked. Awaiting your approval. In dispute.*
  - No private party can silently redirect the funds.
- **Source:** `03-solution.md`, `01-overview.md`
- **Figure:** `assets/figures/01-escrow-flow.png`
- **Speaker time:** ~90s

---

## Slide 4 — Why Blockchain (the pivotal slide)

- **Title:** *A database gives a record. A smart contract gives custody guarantees both parties can verify.*
- **Key message:** Blockchain is justified here by **verifiable custody and programmable release** — and the protocol is honest about what blockchain does NOT do.
- **Bullets:**
  - Database → record, not custody. Card → chargeback risk. Centralized platform → relocates trust.
  - Smart contract changes the **trust model**, not just the technology.
  - 5 properties used: immutability · decentralization · digital signatures · programmable transfer · transparent state.
  - **Does NOT** verify identity · enforce legal judgments · evaluate work quality.
  - Comparison table (see deck appendix).
- **Source:** `04-why-blockchain.md`
- **Figure:** comparison table from `04-why-blockchain.md` §4
- **Speaker time:** ~110s (the longest non-demo slide)

---

## Slide 5 — Architecture

- **Title:** *On-chain for trust. Off-chain for everything else.*
- **Key message:** A four-layer hybrid architecture; the backend never makes custody decisions; the system runs on existing infrastructure.
- **Bullets:**
  - On-chain: escrow state, locked funds, approvals, dispute verdicts.
  - Off-chain: profiles, files, messages, KYC. **Only file hashes go on-chain.**
  - Stack: Solidity (L2) · Next.js · NestJS · Postgres · IPFS · The Graph · viem.
  - **The backend never decides where money goes. The contract does.**
  - No new chain. Deploys on an existing L2.
- **Source:** `05-architecture.md`, `08-scalability.md` (last bullet)
- **Figure:** `assets/figures/02-architecture.png`
- **Speaker time:** ~75s

---

## Slide 6 — Smart Contract

- **Title:** *One factory, many escrows. Each milestone is a state machine.*
- **Key message:** Two contracts (Factory + Escrow), 10 access-controlled functions, a milestone state machine, every meaningful action emits an event.
- **Bullets:**
  - **Factory** — supported-token allowlist, fee config, arbitrator registry.
  - **Escrow** — client, freelancer, token, milestones, balance, dispute status.
  - Strict access control: `msg.sender` + state check on every function.
  - State machine: Created → Funded → Submitted → Approved → Released.
  - **Disputed funds cannot leave the contract without a verdict.**
- **Source:** `06-smart-contract.md`
- **Figure:** `assets/figures/03-milestone-state-machine.png`
- **Speaker time:** ~80s

---

## Slide 7 — Live Demo

- **Title:** *Live demo — the happy path, on testnet.*
- **Key message:** Watch the trust claim demonstrated: create → deposit → submit → approve → release, with two wallets and a public on-chain balance.
- **Bullets (visible on slide while demo runs):**
  - Client creates a 3-milestone escrow.
  - Client deposits 300 mUSDC. **Locked on-chain.**
  - Freelancer submits milestone 1 with deliverable hash.
  - Client approves → contract releases 100 mUSDC. Done.
  - Dispute path is in the contract — narrated, not clicked.
- **Source:** `11-mvp-scope.md`
- **Figure:** none on slide; **live browser windows** are the visual.
- **Speaker time:** ~180s (3 min budget)

---

## Slide 8 — Business Model

- **Title:** *The fee is a few lines in a contract that already exists.*
- **Key message:** The technical design supports the revenue model by construction — no separate billing.
- **Bullets:**
  - **0.5–1.5%** per completed escrow, collected automatically in stablecoin at release.
  - Business subscription — team accounts, reporting, priority support.
  - Dispute fees — shared with arbitrators to align incentives.
  - Customers: international freelancers, startups hiring globally, small agencies.
  - The platform is a **facilitator, not a custodian.**
- **Source:** `09-business-model.md`
- **Figure:** none (or revenue-streams icon row)
- **Speaker time:** ~70s

---

## Slide 9 — Roadmap

- **Title:** *Each phase depends on the verified success of the previous one.*
- **Key message:** A five-phase dependency-driven plan; we are shipping Phase 1 today.
- **Bullets:**
  - **Phase 1 — Proof of concept (✓ today: testnet + minimal UI + happy path).**
  - Phase 2 — MVP / pilot: real L2 stablecoins, indexer, managed disputes.
  - Phase 3 — Business tier: team accounts, fiat ramps.
  - Phase 4 — Hybrid arbitration (Kleros).
  - Phase 5 — Multi-chain scale.
- **Source:** `10-roadmap.md`, `11-mvp-scope.md`
- **Figure:** `assets/figures/05-roadmap.png`
- **Speaker time:** ~60s

---

## Slide 10 — Limitations + Close

- **Title:** *Blockchain exactly where it adds value — and nowhere else.*
- **Key message:** We name what is unsolved, and we close on the thesis.
- **Bullets:**
  - Honest limits: regulation varies · stablecoin de-peg risk · subjective quality needs humans · onboarding friction · contract bugs possible.
  - Mitigations: staged rollout · multiple issuers · hybrid dispute · guided UX · audits + bounty.
  - Buildable today on existing L2s, audited tokens, mature tooling. **No new chain. No speculative technology.**
  - Thesis: *a stablecoin smart-contract escrow can reduce the trust and settlement problems of cross-border freelance work by locking funds transparently and releasing them through programmable milestone rules.*
  - **Thank you.** (References + GitHub link footer.)
- **Source:** `10-roadmap.md` §14.2 and §14.3, `15-references.md`
- **Figure:** none (clean close slide)
- **Speaker time:** ~70s

---

## Time budget total

| Slide | Time |
|---|---|
| 1 Title | 0:30 |
| 2 Problem | 1:15 |
| 3 Solution | 1:30 |
| 4 Why Blockchain | 1:50 |
| 5 Architecture | 1:15 |
| 6 Smart Contract | 1:20 |
| 7 **Live Demo** | **3:00** |
| 8 Business Model | 1:10 |
| 9 Roadmap | 1:00 |
| 10 Limitations + Close | 1:10 |
| **Total** | **~14:00** |

Leaves ~1 min buffer for transitions and live-demo overrun inside the 15-min envelope.

## Speaker assignment

**Deferred** — to be filled in once the team confirms who covers which slides. The video script (`13-video-script.md`) leaves `[SPEAKER]` placeholders so any assignment plugs in cleanly.

## Authoring notes

- Quote the **5 load-bearing claims** verbatim where they appear (see `CLAUDE.md`). Do not paraphrase the thesis or the closing line.
- Tables (Slides 4, 5, 9) can be reduced to 3 rows on-slide; full tables live in the docs and can be shown if asked in Q&A.
- All five figures are in `assets/figures/`. Use them — they are already aligned with the paper.
