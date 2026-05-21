# docs/ — TrustPay Escrow Project Reference

This folder is the **single source of truth** for everything the project needs to produce: pitch deck, video script, MVP code, README. Each file is a focused chunk so any downstream consumer (a Claude session, a teammate, an evaluator) can load only what is relevant.

## How files relate to source whitepapers

Two whitepapers exist at repo root: a long technical one and a short one. Pandoc-converted markdown copies are in `assets/source/`. Every file in `docs/` cites which section(s) of which paper it draws from, at the top of the file. **Files here are reorganizations of that source content, not new claims.** When you need the original full text, read `assets/source/full-whitepaper.md`.

## File map

| # | File | What it contains | Primary downstream use |
|---|---|---|---|
| — | `01-overview.md` | One-page elevator pitch. Thesis, target users, what blockchain adds and does NOT solve. | Stop-here-if-you-only-read-one summary. |
| — | `02-problem.md` | Four problem dimensions (trust, settlement, transparency, dispute). Problem-map table. Game-theoretic framing. | Slide 2; opening of video. |
| — | `03-solution.md` | 5-step user flow. Stakeholder table (6 entities). 3 use cases. | Slide 3; demo narration. |
| — | `04-why-blockchain.md` | Argument vs database / payment provider / centralized platform. 5 blockchain properties. Honest scope. Comparison table. | Slide 4 — pivotal slide. Q&A defense. |
| — | `05-architecture.md` | 4-layer hybrid architecture. On-chain vs off-chain. Tech stack table. Data flow. | Slide 5; MVP web-UI design. |
| — | `06-smart-contract.md` | EscrowFactory + Escrow. State fields. 10 functions + access control. Milestone state machine. Events. | Slide 6; MVP Solidity spec. |
| — | `07-security-dispute.md` | Risk matrix. Admin multisig + 48h timelock. Hybrid dispute model. Anti-abuse controls. | Honesty bullets across slides; Q&A. |
| — | `08-scalability.md` | Why L2. Indexing/caching. Latency. Performance table. | Reference; one bullet on Slide 5 or 9. |
| — | `09-business-model.md` | Revenue (0.5–1.5% tx fee + subscription + dispute). Cost structure. Channels. | Slide 8. |
| — | `10-roadmap.md` | 5 phases with explicit dependencies. | Slide 9. |
| — | `11-mvp-scope.md` | Exact cut of features for the 15-min demo MVP. What is IN, what is OUT. Demo script. | Phase 1+ Phase 2 build; demo storyboard. |
| — | `12-pitch-deck-outline.md` | 10-slide skeleton. Title, key message, bullets, sources, figure per slide. | Slide authoring. |
| — | `13-video-script.md` | English script. Per-slide spoken text. Demo cue points. Speaker placeholders. | Video recording. |
| — | `14-terminology.md` | Glossary. | Consistency check across all docs. |
| — | `15-references.md` | Bitcoin paper, Ethereum white paper, INE5458. | Slide 10 references. |

## Assets

- `assets/source/short-whitepaper.md` — 2-page student-friendly version, pandoc output.
- `assets/source/full-whitepaper.md` — full technical paper, pandoc output. ~1200 lines.
- `assets/figures/01-escrow-flow.png` — end-to-end deposit → release flow.
- `assets/figures/02-architecture.png` — hybrid 4-layer architecture.
- `assets/figures/03-milestone-state-machine.png` — Created → Funded → Submitted → Approved → Released, with Disputed/Refunded branches.
- `assets/figures/04-dispute-flow.png` — open dispute → lock funds → arbitrator rules → contract executes.
- `assets/figures/05-roadmap.png` — 5-phase dependency timeline.

## File top-matter convention

Every doc opens with a short block:

```
> **Source:** Full white paper §X.Y; Short white paper "Section Name"
> **Used by:** Slide N; Video section M; MVP component K
> **See also:** docs/0N-other.md
```

This lets a future Claude session resolve "which file?" in one read of `README.md`.

## Suggested reading order

- **New to the project:** `01-overview.md` → `04-why-blockchain.md` → `03-solution.md`.
- **Building the deck:** `12-pitch-deck-outline.md` first, then individual `02`–`10` as each slide is drafted.
- **Building the MVP:** `11-mvp-scope.md` → `06-smart-contract.md` → `05-architecture.md` → `03-solution.md` (for UI flow).
- **Recording the video:** `13-video-script.md`; refer back as needed.
