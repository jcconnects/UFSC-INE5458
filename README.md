# TrustPay Escrow — INE5458 / UFSC

A stablecoin smart-contract escrow protocol for cross-border freelance work.
Funds lock in an EVM contract; release on milestone approval; no private custodian.

**Course:** INE5458 — Blockchain and Cryptocurrencies Technologies, UFSC.
**Team:** Augusto de Hollanda Vieira Guerner · Eduardo Gwoszdz De Lazari · João Pedro Schmidt Cordeiro · Micael Angelo Sabadin Presotto.

- Whitepapers (long + short) — `docs/assets/source/`.
- Reorganized reference — `docs/01-overview.md` … `docs/15-references.md`.
- MVP scope — `docs/11-mvp-scope.md`.
- Pitch deck outline — `docs/12-pitch-deck-outline.md`.
- Video script — `docs/13-video-script.md`.

> **Video (unlisted YouTube):** _TODO: paste link here after recording_

## Repo layout

```
contracts/   Solidity (Foundry). MockUSDC + EscrowFactory + Escrow + tests.
web/         Next.js 14 (app router) + wagmi + viem + RainbowKit.
docs/        Whitepaper-derived reference; not part of the running app.
scripts/     Build glue (e.g. sync-web.mjs to copy ABIs into web/).
```

## Quick start (local anvil + browser)

```bash
# 1. Install tooling (one-off).
brew install foundry pnpm
pnpm install

# 2. Compile + run all contract tests.
pnpm contracts:test

# 3. Start a local devnet in terminal A.
anvil

# 4. Deploy MockUSDC + EscrowFactory in terminal B.
pnpm contracts:deploy:local
# → writes contracts/deployments/31337.json with addresses.

# 5. Copy ABIs into the web app.
pnpm contracts:sync-web

# 6. Configure the web app.
cp web/.env.example web/.env.local
#   - paste mockUSDC + escrowFactory addresses from deployments/31337.json
#   - set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (free, cloud.walletconnect.com)

# 7. Run the web app.
pnpm web:dev
# → http://localhost:3000
```

In the browser:
- Connect MetaMask, switch to "Local Anvil" (chain id 31337). Import one of anvil's printed private keys as the **client** account.
- On the dashboard, click "Get 1,000 mUSDC" (faucet button — calls `MockUSDC.mint`).
- Create an escrow with 3 milestones × 100 mUSDC, pointing at a second wallet (the **freelancer**).
- Approve + deposit. UI flips to "Funds locked".
- Switch wallet to freelancer → submit milestone (choose any local file, the UI SHA-256 hashes it client-side).
- Switch back → approve → release. Freelancer balance updates.

## Deploying to Sepolia

```bash
export PRIVATE_KEY=0x<deployer key with sepolia ETH>
export SEPOLIA_RPC_URL=https://<your sepolia rpc endpoint>

cd contracts
forge script script/Deploy.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify --etherscan-api-key $ETHERSCAN_API_KEY   # optional
```

Then update `web/.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=$SEPOLIA_RPC_URL
NEXT_PUBLIC_MOCK_USDC=<from deployments/11155111.json>
NEXT_PUBLIC_ESCROW_FACTORY=<from deployments/11155111.json>
```

Optionally pre-seed the demo client wallet:

```bash
CLIENT_ADDRESS=0xYourClientDemoWallet \
MOCK_USDC=0xMockUSDCFromDeploy \
forge script contracts/script/SeedDemo.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
```

## MVP scope checklist (from `docs/11-mvp-scope.md`)

- [x] Two-contract design — `EscrowFactory` + `Escrow` per agreement.
- [x] Five demo functions: `createEscrow`, `deposit`, `submitMilestone`, `approveMilestone`, `releasePayment`.
- [x] Dispute path implemented in contract (narrated only, no UI affordance).
- [x] `refund(deadline)`, `requestChanges`, `cancelBeforeFunding` implemented.
- [x] Reentrancy guard + checks-effects-interactions on every transfer.
- [x] Stablecoin allowlist enforced at factory.
- [x] Tests cover happy path + per-function negatives (35/35 green).
- [x] Web UI: 5 screens — Connect/dashboard, Create, Status (client + freelancer branches).
- [x] No off-chain backend; UI talks to chain directly via wagmi+viem.
- [ ] Sepolia deploy + recorded demo (post-implementation step).

## Honest scope (from `docs/04-why-blockchain.md`)

The protocol **does not** verify identity, enforce legal judgments, or evaluate work quality.
It does what blockchain is uniquely good at: programmable custody and verifiable settlement.
Disputes are still resolved by a human or decentralized arbitration layer; the contract only executes the verdict.
