# 11 — MVP Scope (Demoable for 15-Minute Pitch)

> **Source:** Derived from user decisions; maps to Phase 1 + early Phase 2 of `10-roadmap.md`.
> **Used by:** Slide 7 (Demo), Slide 9 (Roadmap context), MVP smart-contract spec, MVP web-UI spec, delivery README.
> **See also:** `06-smart-contract.md`, `05-architecture.md`, `03-solution.md`, `13-video-script.md`.

## Scope principle

For the 15-minute pitch we ship the **happy-path core** of the protocol — what proves the trust-model claim — and explicitly defer everything else with a one-line reason.

## IN — what we build and demo live

### Smart contracts (Solidity, EVM L2 testnet)
- **EscrowFactory.sol** — creates Escrow instances; holds supported-token allowlist (mock USDC only for the demo).
- **Escrow.sol** — holds locked funds; enforces the milestone state machine for the happy path.
- **MockUSDC.sol** — test ERC-20 with public `mint(to, amount)` so we can fund demo wallets without ramps.

Functions exercised in the demo:
1. `createEscrow(freelancer, token, amounts[], deadlines[])`
2. `deposit()`
3. `submitMilestone(id, deliverableHash)`
4. `approveMilestone(id)`
5. `releasePayment(id)`

Events emitted and visible in UI: `EscrowCreated`, `FundDeposited`, `MilestoneSubmitted`, `MilestoneApproved`, `PaymentReleased`.

### Web UI (Next.js + wagmi + viem)
Five screens, each maps to one demo beat:
1. **Connect** — wallet connect (MetaMask or browser-injected). Shows mock USDC balance.
2. **Create Escrow** — form: freelancer address, milestone list (amount + deadline). Submit → `createEscrow` → deposit prompt.
3. **Escrow Status (Client view)** — "Funds locked. Awaiting freelancer." with milestone list and current state.
4. **Escrow Status (Freelancer view)** — same data, but with "Submit milestone" button per Funded milestone. Hash from a chosen local file.
5. **Approve & Release** — client view shows "Awaiting your approval" → click → release transaction → "Paid" status.

UI shows transaction hashes and links to the testnet explorer so the audience sees on-chain verifiability.

### Testnet target
**Sepolia** (Ethereum L2 testnet, abundant faucets, broad wallet support) — primary choice.
Polygon Amoy as fallback if Sepolia gas/faucet is unavailable.
*Decision finalized at scaffolding time, not now.*

### Demo wallets
Two browser profiles, each with a different wallet:
- **Client wallet** — pre-funded with mock USDC and testnet ETH for gas.
- **Freelancer wallet** — only testnet ETH for gas.

## OUT — explicitly deferred (state in the demo)

| Cut feature | Why deferred | Where it lives in the plan |
|---|---|---|
| Live dispute flow | Adds ~5 min of demo time; complicates wallet juggling. **Contract supports it; we narrate, do not click.** | `07-security-dispute.md`, Phase 1+ in `10-roadmap.md` |
| `refund` after deadline | Time-dependent; cannot demo cleanly inside 15 min. | `06-smart-contract.md` |
| `requestChanges` rework loop | Branch of happy path; mentioned in narration. | `06-smart-contract.md` |
| Business tier (team accounts, invoices) | Phase 3. | `09-business-model.md`, Phase 3 |
| Fiat on/off-ramps | Phase 3. | Phase 3 |
| The Graph / event indexer | UI reads contract directly via `useReadContract` from wagmi — good enough at demo volume. | Phase 2 |
| NestJS backend / Postgres / IPFS | Same — not needed for a single-flow demo. | Phase 2+ |
| Real KYC | Not relevant for a testnet demo. | Phase 2+ |
| Decentralized arbitration (Kleros) | Phase 4. | Phase 4 |
| Multi-chain | Phase 5. | Phase 5 |

## The demo script (≈ 3 minutes of the 15-min video)

Numbers are time-boxed so the live demo never runs long.

| Time | Beat | What audience sees |
|---|---|---|
| 0:00 | **Setup shot** | Both browser profiles side-by-side. Client wallet shows 1,000 mUSDC balance. |
| 0:15 | **Create escrow** (client) | Fill form: 3 milestones × 100 mUSDC. Click *Create*. Wallet popup. Sign. Contract address appears. |
| 0:45 | **Deposit** (client) | Click *Deposit 300 mUSDC*. Two wallet popups: ERC-20 approve, then deposit. UI status flips to "Funds locked". |
| 1:15 | **Verify on-chain** | Open testnet explorer, point to contract balance = 300 mUSDC. **"The freelancer can see this without trusting us."** |
| 1:35 | **Submit milestone** (freelancer) | Switch to freelancer profile. Status shows "Funds locked. Milestone 1 funded — awaiting your work." Click *Submit*, choose a file → on-chain hash is computed → transaction. |
| 2:00 | **Approve & release** (client) | Switch back. Status: "Awaiting your approval." Click *Approve*. Wallet popup → sign. UI: "Released — 100 mUSDC paid to freelancer." Freelancer balance updates. |
| 2:30 | **Narrate the rest** | "Milestones 2 and 3 repeat the same cycle. If we disagreed, *Open Dispute* would lock the funds; an arbitrator would rule; the contract would execute the verdict. We are not demoing that path today — but it is the same contract." |
| 2:45 | **Close demo** | Back to slides. |

## File layout for the MVP (to be created in a follow-up request)

Suggested (not built this round):
```
/contracts                  # Hardhat or Foundry
  /src
    EscrowFactory.sol
    Escrow.sol
    MockUSDC.sol
  /test
    Escrow.t.sol            # full happy path + at-least-one negative test per function
  /script
    Deploy.s.sol
  hardhat.config.ts | foundry.toml
/web                        # Next.js (app router)
  /app
    /page.tsx               # Connect + dashboard
    /escrow/[address]/page.tsx
  /lib
    abi.ts                  # generated from contracts
    contracts.ts            # addresses by chain id
    wagmi.ts
  package.json
README.md                   # delivery: links to YouTube video + how to run locally
```

## Success criteria for the demo

- [ ] Two wallets visibly hold different balances before and after.
- [ ] Each on-chain action emits a visible transaction hash that resolves on the explorer.
- [ ] The audience hears the trust claim demonstrated: **"the freelancer verifies on-chain, before working."**
- [ ] No off-chain backend in the demo. The UI talks to the chain directly. (Reinforces "the platform does not custody.")
- [ ] Total demo runtime ≤ 3 minutes; the remaining 12 minutes are slides + Q&A buffer.

## Slide-ready hooks

- "What we shipped: **the happy path on Sepolia, with mock USDC.**"
- "What we did not ship: dispute flow, fiat ramps, business tier. **Each is mapped to a roadmap phase.**"
- "No off-chain backend in the demo. **The UI talks to the chain directly.** That is the point."
