# 13 — Video Script (10–15 minutes, English)

> **Source:** Synthesized from `01`–`11`. Slide-aligned with `12-pitch-deck-outline.md`.
> **Used by:** Video recording.
> **See also:** `12-pitch-deck-outline.md`, `11-mvp-scope.md`.

## Conventions

- `[SPEAKER]` = placeholder for the team member taking that section. **Assignment deferred** — pick one of: Augusto, Eduardo, João Pedro, Micael per slide once the team decides.
- *(Stage cue)* = direction (camera, screen share, demo action). Do not read aloud.
- **Bold** = emphasis when speaking.
- Word budget total ~1700 words → ~13 spoken minutes at 130 wpm. Add the ~3-min demo on Slide 7 → ~14 min total.

---

## Slide 1 — Title + Team  *(target ~30s)*

**[SPEAKER A]:** Hi. We are Team TrustPay Escrow — Augusto, Eduardo, João Pedro, and Micael, from INE5458 at UFSC. Over the next fifteen minutes we will show you a protocol we designed and a working demo we built on Ethereum testnet. The project is **TrustPay Escrow** — a stablecoin smart-contract escrow for cross-border freelance work. This is the v1.0 of a living white paper, with a running proof of concept. Let's start with the problem.

*(Transition slide.)*

---

## Slide 2 — The Problem  *(target ~75s)*

**[SPEAKER]:** International freelance work is genuinely global today. A designer in Brazil gets hired by a startup in Germany. A developer in Vietnam works for an agency in Canada. They have never met. They live under different legal systems. And **someone always has to go first**.

If the client pays in advance and the work never arrives, the client loses the money. If the freelancer delivers first and the client refuses to pay — or files a chargeback months later — the freelancer loses weeks of labor. Cross-border bank transfers are slow and expensive. Card payments add chargeback risk on top.

There is one workaround that already exists: centralized freelance marketplaces that hold the client's payment and release it on completion. **That works — but it only relocates the trust problem.** Users must trust the platform as the sole custodian of their funds and the sole, opaque judge of their disputes. The custody ledger is private. The user cannot independently verify that the money is still there, untouched, available. The escrow exists. **It is just invisible and discretionary.**

So the problem we are solving is not "freelancers want crypto." It is: **how do you let two strangers settle conditionally, across borders, without trusting a private intermediary?**

---

## Slide 3 — The Solution  *(target ~90s)*

**[SPEAKER]:** TrustPay Escrow locks the payment in a smart contract until work is delivered. Three steps.

*(Point to figure on slide.)*

**Step one — lock funds.** The client deposits the full project amount in a regulated stablecoin — USDC or USDT, pegged to the US dollar — into our smart contract. The funds are locked, on-chain.

**Step two — deliver milestone.** The freelancer can independently check the contract before doing any work. The money is there. They do the work, submit the milestone, and a content hash of the deliverable goes on-chain. The file itself stays off-chain.

**Step three — release payment.** The client approves the milestone. The contract automatically transfers that milestone's amount to the freelancer, minus a small platform fee. **No private party can secretly redirect the funds.**

If the parties disagree, the disputed portion stays locked while a human arbitrator rules — we'll come back to that.

A note on usability: blockchain UX is a real adoption barrier, and we take that seriously. The platform abstracts the chain behind plain-language statuses. Users see *"Funds locked. Awaiting your approval. In dispute."* Not raw transaction hashes. Not state enums. Wallet setup is guided. Gas costs are estimated before any signature. **We hide blockchain — except where users genuinely need to see it.**

---

## Slide 4 — Why Blockchain  *(target ~110s — the pivotal slide)*

**[SPEAKER]:** This is the most important slide. Our course is explicit: if you cannot answer "why blockchain?" by comparing concrete alternatives, you probably do not need a blockchain. So we'll do exactly that.

**A traditional database** can record escrow status and milestones. It cannot remove the need to trust the company that controls the database. Records can be edited, schemas changed, and the money — sitting in a bank account — can be frozen by the operator. A database gives a record. It does not give custody guarantees both parties can verify.

**A bank or card processor** moves money well — but it acts as the central custodian and arbiter. Card payments add chargeback risk that can reverse a settled payment months later. Catastrophic for a freelancer who has already delivered.

**A centralized freelance platform** is the closest existing solution. It works — but as we said, the custody ledger is private and discretionary.

**A smart contract changes the trust model, not just the technology.** Once funds are deposited, the release rules are publicly defined in deployed bytecode and executed by the network. The platform can provide usability and support. It **cannot** secretly alter the financial state of the escrow.

Five blockchain properties make this work, and we use all of them: **immutability** of the rules and history. **Decentralization** — no single private party holds custody. **Digital signatures** — only the client can approve, only the freelancer can submit, only the arbitrator can resolve. Enforced cryptographically, not by policy. **Programmable token transfer** — payment is a consequence of an on-chain condition. **Transparent state** — both parties can independently verify the escrow's exact state at any time.

And — being honest — blockchain **does not** verify real-world identity, does not enforce legal judgments, and does not evaluate whether work is good. Identity is handled off-chain by optional KYC. Legal enforcement is handled by terms of service. Quality is handled by the human arbitration layer. **The contract executes a verdict; it never forms one.**

Blockchain is justified here by **verifiable custody and programmable release. Not by novelty.**

---

## Slide 5 — Architecture  *(target ~75s)*

**[SPEAKER]:** Architecturally we are hybrid by design. **On-chain for trust. Off-chain for everything else.**

On-chain we store only what determines fund custody: escrow state, milestone amounts, approvals, releases, dispute verdicts, and deliverable hashes. That's it.

Off-chain we keep user profiles, deliverable files, messages, identity data — anything that would be expensive, private, or pointless to put on-chain. When a deliverable must be verifiable, only its cryptographic hash is anchored on-chain. The file stays where files belong.

The stack is deliberately boring: Solidity contracts on an EVM Layer 2, a Next.js frontend, a Node backend, Postgres for off-chain data, IPFS for files, an event indexer like The Graph. All mature, all audited, all standard. We are **not** building a new chain. The platform runs on existing infrastructure.

The most important property here is the security one: **the backend never makes custody decisions.** The smart contract executes the rules. The backend listens to events and updates dashboards. A bug in the off-chain code **cannot** misdirect escrowed funds.

---

## Slide 6 — Smart Contract  *(target ~80s)*

**[SPEAKER]:** Two contract types. **EscrowFactory** — one of them, platform-wide, holds the supported-token allowlist, fee config, and arbitrator registry. **Escrow** — many of them, one per agreement.

Each Escrow holds the client, the freelancer, the stablecoin address, the milestone list, the balance, and the dispute status. Each milestone has an amount, a deadline, a state, and once submitted, a content hash.

Ten core functions, each with strict access control — `msg.sender` is checked against the role, and the current state is checked against the allowed transitions. Only the client can approve. Only the freelancer can submit. Only the arbitrator can resolve.

Every milestone is a tiny state machine. *(Point to figure.)* Created → Funded → Submitted → Approved → Released. With Disputed and Refunded branches. **And the load-bearing rule: disputed funds cannot leave the contract without a verdict.** Ever.

Every action emits an event. The off-chain indexer reconstructs state from those events without trusting anyone. Dashboards, notifications, reports — all built from the event stream.

Design priority is conservative: small first version, audited stablecoin allowlist, checks-effects-interactions plus a reentrancy guard around every token transfer. **The contract custodies real money — security over cleverness.**

---

## Slide 7 — Live Demo  *(target ~180s)*

**[SPEAKER]:** Let me show this end-to-end.

*(Switch to screen share. Two browser profiles side by side: Client and Freelancer.)*

You see two wallets. **Client wallet** on the left has 1,000 mock USDC and some testnet ETH for gas. **Freelancer wallet** on the right has only testnet ETH — no USDC yet.

*(Action: client creates escrow.)*

The client fills out a new escrow — freelancer's address, three milestones, 100 mock USDC each. They click **Create**. MetaMask pops up, they sign, and the factory deploys a new Escrow contract. The address shows up on screen.

*(Action: client deposits.)*

The client clicks **Deposit 300 mUSDC**. Two transactions — an ERC-20 approve and the deposit. UI flips to **"Funds locked. Awaiting freelancer."**

*(Action: open block explorer in a tab.)*

Here is the contract on the testnet explorer. Balance: 300 mUSDC. **And this is the point — the freelancer can see this without trusting our platform at all.**

*(Switch to freelancer profile.)*

Now the freelancer. Same UI. Status: "Funds locked. Milestone 1 funded — awaiting your work." They click **Submit milestone**, pick a file. The browser hashes it locally. The hash goes on-chain.

*(Switch back to client.)*

Client sees: **"Awaiting your approval — milestone 1 submitted."** They click **Approve**. One more signature. UI: **"Released — 100 mUSDC paid to freelancer."** Freelancer's balance, on the right, updates from zero to one hundred. We just paid someone, on-chain, with rules a contract enforced.

*(Pause.)*

Milestones two and three repeat the same cycle. If we disagreed, the client would click **Open Dispute** — funds stay locked, evidence goes in, an arbitrator rules, the contract executes the verdict. We're not demoing that path today inside the time budget, **but it is the same contract.**

*(Cut screen share.)*

---

## Slide 8 — Business Model  *(target ~70s)*

**[SPEAKER]:** A protocol that custodies real money has to be a viable business. Three revenue streams.

**Transaction fee** — about half a percent to one and a half percent per completed escrow, deducted automatically in stablecoin at the moment of release. **The fee is a few lines in a contract that already exists** for custody reasons. No separate billing system. No intermediary.

**Business subscription** — a paid tier for companies: team accounts, advanced reporting, priority support.

**Dispute resolution fees** — premium arbitration, shared with arbitrators to align their incentives toward fair, timely rulings.

The customers are international freelancers, startups and small businesses hiring globally, and small agencies. The non-negotiable costs are **security audits and compliance** — because the protocol custodies user funds. We are not cutting those.

And to be clear about positioning: **the platform is a facilitator, not a custodian.** That is the whole point.

---

## Slide 9 — Roadmap  *(target ~60s)*

**[SPEAKER]:** Five phases, each one depending on the verified success of the previous one. We are not shipping Phase 5 today and pretending it works.

**Phase 1 — Proof of concept.** Testnet contract, basic UI, complete deposit-to-release flow. **That is what you just saw.**
**Phase 2 — MVP / pilot.** Deployment on a real low-cost L2 with real stablecoins. Event indexer. Platform-managed disputes.
**Phase 3 — Business tier.** Team accounts, invoices, fiat on- and off-ramps.
**Phase 4 — Hybrid arbitration.** Decentralized arbitration alongside platform moderation. Kleros-style.
**Phase 5 — Scale.** Multi-chain and broader stablecoin coverage.

Each phase only starts when the previous one is validated. That is a feature of the plan, not a constraint on it.

---

## Slide 10 — Limitations + Close  *(target ~70s)*

**[SPEAKER]:** We owe you the honest part.

Regulation varies country to country and is still evolving. A stablecoin de-peg or issuer freeze would affect locked value. The protocol cannot evaluate subjective work quality — that always needs a human arbitrator. Smart-contract bugs are possible despite audits. And onboarding non-crypto users to wallets and gas is a real friction. We do not hide any of these — each maps to a mitigation in the white paper.

The system is **buildable today.** Audited token standards. Existing Layer 2s. Mature wallets. Established indexing. **No new blockchain. No speculative technology.**

The thesis is narrow and testable: **a stablecoin smart-contract escrow can reduce the trust and settlement problems of cross-border freelance work by locking funds transparently and releasing them through programmable milestone rules.**

That is what we designed. That is what we built. **And blockchain — exactly where it adds value, and nowhere else.**

Thank you.

*(End card: GitHub link, white paper, team names.)*

---

## Total spoken time estimate

- Sum of slide targets above: ~14:20.
- Inside the 15-min envelope with ~40s of natural pauses and transitions.

## Per-section speaker assignment (deferred)

Once the team agrees, replace each `[SPEAKER]` with a name. Suggested contiguous splits (pick one and apply):
- **By thirds:** Problem/Solution (1 person) — Why Blockchain/Architecture/Smart Contract (1 person) — Demo (1 person) — Business/Roadmap/Close (1 person).
- **By interest:** assign Demo to whoever wrote the most contract code; assign Why Blockchain to whoever is strongest on argument; assign Business/Close to whoever pitches best.

## Production checklist

- [ ] Two browser profiles set up, both with funded testnet wallets.
- [ ] Mock USDC pre-minted to the client wallet (1,000 mUSDC) and zero to freelancer.
- [ ] Block explorer tab pre-loaded on the contract address.
- [ ] Slides exported as PDF + delivered in Google Slides or Keynote.
- [ ] Microphone test per speaker.
- [ ] Recorded as a single take where possible; cut + transition only at slide boundaries.
- [ ] Upload to YouTube as **unlisted**. Save link.
