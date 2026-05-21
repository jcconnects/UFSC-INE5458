# 06 — Smart Contract Design

> **Source:** Full white paper §7 (Smart Contract Design).
> **Used by:** Slide 6 (Smart Contract), MVP Solidity implementation spec.
> **See also:** `05-architecture.md`, `07-security-dispute.md`, `11-mvp-scope.md`, `14-terminology.md`.

## Two contract types

1. **EscrowFactory** — single, platform-wide. Deploys new Escrow instances. Holds platform-wide parameters.
2. **Escrow** — many instances, one per agreement. Holds locked funds, enforces state, executes releases.

## EscrowFactory — what it holds

- Fee receiver address.
- Platform fee rate (capped by hard-coded maximum).
- **Supported stablecoin allowlist** (a security control — restricting to a short, audited set, enforced at escrow creation).
- Address(es) authorized to act as **arbitrators**.

Centralizing these in the factory means a new escrow is created with correct, consistent settings.

## Escrow instance — state fields

Each Escrow contract stores:
- `client` address
- `freelancer` address
- `token` — stablecoin ERC-20 address
- `milestones[]` — ordered list, each with: `amount`, `deadline`, `state`, `deliverableHash`
- `status` — escrow-level current status
- `depositedBalance`
- `disputeStatus`

## Core functions and access control

| Function | Caller | Effect |
|---|---|---|
| `createEscrow(...)` | Client (via factory) | Deploys an escrow with the parties, token, and milestone list. |
| `deposit()` | Client | Transfers stablecoin into the contract; locks funds; moves milestones to **Funded**. |
| `submitMilestone(id, hash)` | Freelancer | Marks a funded milestone as **Submitted**; records deliverable hash. |
| `approveMilestone(id)` | Client | Approves a submitted milestone, enabling release. |
| `requestChanges(id)` | Client | Returns a submitted milestone to the freelancer for rework. |
| `releasePayment(id)` | Client or freelancer | Transfers an approved milestone's amount (minus fee) to the freelancer. |
| `openDispute(id)` | Client or freelancer | Locks the disputed milestone pending arbitration; records a dispute fee/stake. |
| `resolveDispute(id, verdict)` | **Arbitrator only** | Executes the verdict: pay, refund, or split the disputed amount. |
| `refund(id)` | Client (after deadline) | Returns a funded-but-undelivered milestone's amount after its deadline. |
| `cancelBeforeFunding()` | Client | Cancels an escrow that has been created but not yet funded. |

— Full white paper Table 5.

**Access control rule:** each function checks `msg.sender` against the role allowed to call it, AND against the current state. No function may run in a state that does not permit it.

## Milestone state machine

States: **Created → Funded → Submitted → {Approved → Released} | Disputed → Resolved | Refunded**

Figure: `assets/figures/03-milestone-state-machine.png`.

Key rule: funds can only be released from a milestone that is `Approved` **or** whose dispute has been `Resolved` in the freelancer's favor. Disputed funds **cannot leave the contract without a verdict.**

## Emitted events

Every meaningful action emits an event so the off-chain indexer can reconstruct state without trusting any intermediary:

- `EscrowCreated`
- `FundDeposited`
- `MilestoneSubmitted`
- `MilestoneApproved`
- `PaymentReleased`
- `DisputeOpened`
- `DisputeResolved`
- `RefundIssued`

Dashboards, notifications, and reporting are all built from this event stream.

## Conservative design principles

The first implementation deliberately favors simplicity over feature richness:
- Small number of **audited stablecoin interfaces** only (the allowlist).
- **Checks-effects-interactions pattern** plus an explicit **reentrancy guard** around every token transfer.
- No speculative on-chain features.
- Custody-of-real-money grade test coverage before any mainnet deployment.

**Security rather than cleverness is the design priority — the contracts custody real money.**

## MVP cut (for the demo) — see `11-mvp-scope.md` for full scope

In the 15-min demo, only these functions are exercised:
1. `createEscrow` (factory)
2. `deposit`
3. `submitMilestone`
4. `approveMilestone`
5. `releasePayment`

Dispute path (`openDispute`/`resolveDispute`) is implemented in the contract for completeness but **not demoed live** — the script narrates it instead. `refund` and `requestChanges` are stretch goals.

## Pseudocode sketch (for slide reference, not the real contract)

```solidity
// EscrowFactory
function createEscrow(
    address freelancer,
    address token,
    uint256[] calldata amounts,
    uint256[] calldata deadlines
) external returns (address);

// Escrow instance
function deposit() external;                              // client; ERC-20 pull
function submitMilestone(uint256 id, bytes32 hash) external; // freelancer
function approveMilestone(uint256 id) external;           // client
function releasePayment(uint256 id) external;             // client or freelancer
function openDispute(uint256 id) external payable;        // either party + stake
function resolveDispute(uint256 id, Verdict v) external;  // arbitrator only
function refund(uint256 id) external;                     // client, after deadline
```

## Slide-ready hooks

- "Two contracts: **one factory, many escrows.** One escrow per agreement."
- "Each milestone is a tiny state machine. **Disputed funds cannot leave the contract without a verdict.**"
- "Events drive everything off-chain. The contract is the source of truth — the dashboard is a projection."
- "Security over cleverness. **The contract custodies real money.**"
