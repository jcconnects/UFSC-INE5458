# TrustPay Escrow — Project Context for Claude

**One-liner:** A stablecoin smart-contract escrow protocol for cross-border freelance work. Funds lock in an EVM contract; release on milestone approval; no private custodian.

**Course:** INE5458 — Blockchain and Cryptocurrencies Technologies, Universidade Federal de Santa Catarina (UFSC).
**Team:** Augusto de Hollanda Vieira Guerner · Eduardo Gwoszdz De Lazari · João Pedro Schmidt Cordeiro · Micael Angelo Sabadin Presotto.
**Status:** Whitepapers v1.0 complete (short + long). MVP + pitch deck + video pending.

## Delivery goals

1. **10-slide pitch deck** (English).
2. **10–15 minute team-pitch video**, uploaded unlisted to YouTube.
3. **MVP**: Solidity escrow contract on EVM testnet + minimal Next.js web UI demonstrating happy path (create → deposit → submit → approve → release) with mock USDC. Dispute flow deferred.
4. Deliver: YouTube link + code repo.

## How to navigate this repo

All organized project content lives under `docs/`. Start with `docs/README.md` for the map. The two source whitepapers (`.docx`) sit at repo root, preserved verbatim; pandoc-converted markdown copies are in `docs/assets/source/`.

```
docs/
├── README.md                   ← start here
├── 01-overview.md              ← elevator pitch + thesis
├── 02-problem.md               ← problem framing
├── 03-solution.md              ← user flow + stakeholders + use cases
├── 04-why-blockchain.md        ← the pivotal argument
├── 05-architecture.md          ← hybrid 4-layer architecture
├── 06-smart-contract.md        ← Escrow + Factory design, state machine
├── 07-security-dispute.md      ← risk matrix + dispute flow
├── 08-scalability.md           ← L2, indexing, performance
├── 09-business-model.md        ← revenue + GTM
├── 10-roadmap.md               ← 5-phase plan
├── 11-mvp-scope.md             ← what gets built for the demo (Phase 1 cut)
├── 12-pitch-deck-outline.md    ← 10-slide skeleton
├── 13-video-script.md          ← English script, ~1500-2000 words
├── 14-terminology.md           ← glossary
├── 15-references.md            ← Bitcoin/Ethereum papers + INE5458
└── assets/
    ├── source/                 ← pandoc markdown of both whitepapers
    └── figures/                ← 5 PNGs extracted from the long paper
```

## Load-bearing claims (do not paraphrase loosely)

- **Thesis** (Full §1.3): "a stablecoin smart-contract escrow can reduce the trust and settlement problems of cross-border freelance work by locking funds transparently and releasing them through programmable milestone rules."
- **Trust model** (Full §5.2): "A smart contract changes the trust model, not merely the technology."
- **Honest scope** (Full §5.3): blockchain does NOT verify identity, enforce legal judgments, or evaluate work quality.
- **Innovation** (Full §12): stablecoin settlement + milestone-based escrow + verifiable contract state + dispute workflow — NOT "accepting crypto payments".
- **Close** (Full §14.3): "blockchain exactly where it adds value and nowhere else".

## Working agreements

- Pitch language: **English** (slides and video).
- Tech docs and code: English.
- Team role split for video sections: **deferred** — ask before assigning speakers.
- Tech stack (suggested in paper): Solidity (EVM L2), Next.js, NestJS, Postgres, IPFS, The Graph, ethers.js/viem.
- MVP cuts from suggested stack: skip NestJS/Postgres/IPFS/The Graph for the demo. Frontend talks to contract via wagmi+viem directly.
- Target testnet for MVP: Sepolia or Polygon Amoy (decide at scaffolding time).

## When asked to do downstream work

| Task | Files to load first |
|---|---|
| Build/edit slide deck | `docs/12-pitch-deck-outline.md`, `docs/01-overview.md` |
| Write/edit video script | `docs/13-video-script.md`, then cross-refs |
| Scaffold MVP smart contract | `docs/06-smart-contract.md`, `docs/11-mvp-scope.md`, `docs/14-terminology.md` |
| Scaffold MVP web UI | `docs/03-solution.md`, `docs/05-architecture.md`, `docs/11-mvp-scope.md` |
| Prep Q&A / objection handling | `docs/04-why-blockchain.md`, `docs/07-security-dispute.md`, `docs/09-business-model.md` |
| Write delivery README | `docs/01-overview.md` + `docs/11-mvp-scope.md` |
