# DEMO RUNBOOK — zero-popup happy path (local anvil)

One command, two browser windows, **no MetaMask, no wallet popups**. Target: single ~2-minute take.

> How it works: the web app runs in demo mode (`NEXT_PUBLIC_DEMO=1`). Each window
> auto-connects a built-in demo wallet chosen by `?role=` in the URL — Client (anvil #0)
> or Freelancer (anvil #1) — and signs transactions instantly, in-page.
> **Bold lines below = speak them.** Everything else = do it.

---

## 1 · Start (before every take) — ~1 min

```bash
pnpm demo:up
```

Wait for **READY** + the Next.js dev server, then open two windows of the same Chrome profile:

| Window | URL | Snap to |
| --- | --- | --- |
| **Client** | `http://localhost:3000/?role=client` | left half |
| **Freelancer** | `http://localhost:3000/?role=freelancer` | right half |

The role sticks per window (survives navigation). Sanity check the headers:
left = **CLIENT · 1,000 mUSDC**, right = **FREELANCER · 0 mUSDC**.

Also once: put any small file on the Desktop named `deliverable.pdf` (used in beat 3).

> **Optional pre-flight:** with the stack up, `pnpm demo:e2e` clicks through all
> beats in a headless browser and asserts the final 700/100 balances. It consumes
> chain state — run `pnpm demo:up` again afterwards before recording.

## 2 · Record (macOS)

- Focus/Do Not Disturb **ON**. Close everything except the two windows.
- `Cmd+Shift+5` → **Record Selected Portion** → frame both windows → Record.
- Stop: ⏹ in the menu bar. Trim the ends in QuickTime (`Cmd+T`).

## 3 · The take — 5 beats

**"Live demo — the happy path, on a test network. Two wallets: client on the left with 1,000 mock USDC, freelancer on the right with zero."**

### [1] Create — LEFT window
Click **Create escrow**. The form is pre-filled: freelancer address + 3 × 100 mUSDC. Click **Create** → it lands on the escrow page.
**"The client creates a three-milestone escrow — 100 mock USDC per milestone."**
Then RIGHT window: the escrow appeared on the dashboard → click it.

### [2] Deposit — LEFT window
Click **Approve + Deposit 300 mUSDC** (one button, two instant transactions). Status flips to **Funds locked**, Locked shows **300**. The right window follows within ~5 s.
**"300 locked in the contract — the freelancer verifies this on-chain before writing a line of code. No trust in us required."**

### [3] Submit — RIGHT window
Milestone 1 → **Submit milestone (choose file)** → pick `deliverable.pdf`.
**"The freelancer submits milestone one. The file is hashed locally — only the hash goes on-chain."**
The `deliverable:` hash appears in both windows.

### [4] Approve & release — LEFT window
Click **Approve**, then **Release payment** → **✓ Paid to freelancer**. Right header ticks **0 → 100**.
**"The client approves — the contract releases 100 mock USDC. No invoice, no intermediary, no ten-day hold. Done."**

### [5] Dispute — narrate only, click nothing
**"Milestones two and three repeat the cycle. On disagreement, either side opens a dispute: funds stay locked, an arbitrator rules, the contract executes the verdict. Same contract — covered by our tests, narrated today for time."**

Stop recording.

## 4 · Retake

`Ctrl-C` in the `demo:up` terminal → `pnpm demo:up` → reload both windows. Fresh 1,000 / 0 every time, same contract addresses.

## Optional proof beat (terminal, after [2])

The escrow address is the last path segment of the left window's URL (`/escrow/0x…`).

```bash
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "balanceOf(address)(uint256)" <ESCROW_ADDRESS> --rpc-url http://127.0.0.1:8545
```

Prints `300000000` (6 decimals) — **"that's the contract's balance, read straight from the chain."**

## If something breaks

| Symptom | Fix |
| --- | --- |
| Header shows "Connect as Client / Freelancer" buttons | window opened without `?role=` — click the right button, or reopen with the URL |
| Header balance wrong / stale | reload the window; still wrong → full reset (§4) |
| `demo:up` fails on ports | it kills 8545/3000 owners itself — re-run; if it persists, `lsof -ti tcp:8545 tcp:3000 \| xargs kill` |
| Left header not 1,000 after start | seed step failed — re-run `pnpm demo:up`, watch its output |
