# 15 — References and Inspiration

> **Source:** Full white paper Appendix C.
> **Used by:** Slide 10 footer; delivery README.

The white paper follows the audience-targeted strategy taught in INE5458 and adopts the **living-document** format of the Ethereum white paper. Two canonical references informed structure and tone:

- S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System" — <https://bitcoin.org/bitcoin.pdf>
- V. Buterin et al., "Ethereum White Paper" (living document) — <https://ethereum.org/en/whitepaper/>

## Course

- INE5458 — Blockchain and Cryptocurrencies Technologies — Universidade Federal de Santa Catarina (UFSC).

## Project documents

- Short white paper: `TrustPay_Escrow_Short_White_Paper.docx` (repo root); markdown copy at `docs/assets/source/short-whitepaper.md`.
- Full technical white paper: `TrustPay_Escrow_White_Paper.docx` (repo root); markdown copy at `docs/assets/source/full-whitepaper.md`.
- Figures (extracted): `docs/assets/figures/01-escrow-flow.png` through `05-roadmap.png`.

## External standards and tooling referenced in the design

- **ERC-20** — Ethereum token standard used by USDC, USDT, and the mock token in the MVP.
- **EVM Layer 2 networks** — Sepolia (testnet, MVP target), Polygon, Arbitrum, Optimism, Base (mainnet candidates for Phase 2).
- **Kleros** — decentralized arbitration protocol referenced for Phase 4.
- **The Graph** — referenced as the canonical event-indexing approach for Phase 2.
- **OpenZeppelin** — standard library for audited Solidity components (recommended for production; reentrancy guard and ERC-20 helpers used in v1 contract sketch).
