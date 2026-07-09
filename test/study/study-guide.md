# INE5458 — Conceptual Test Study Guide

**Course:** Blockchain and Cryptocurrencies Technologies (UFSC) · Instructor: Jean Martina
**Exam shape:** ~12 questions, ~1 hour, on Moodle Provas, covering everything from the semester. **Conceptual** — definitions, distinctions, and "why blockchain" reasoning. Not math, not Solidity syntax.

How to use this guide: each section opens with *what to know*, then tight bullet definitions (load-bearing term in **bold**), comparison tables for the high-yield **X vs Y** distinctions, and named lists/taxonomies. A companion Anki deck (`anki-deck.tsv`) drills every item here — import instructions are at the bottom.

---

## 0. Signature themes (the angles questions are framed from)

These recur across every topic. If you can hold these five, you can reason your way through most questions.

- **Shift trust from people to math.** Blockchain doesn't remove trust — it moves it from institutions (banks, registries) to cryptographic protocols. *"Trustless" = "I trust the system, not a specific entity."*
- **Nothing here is new; the glue is.** Every primitive predates Bitcoin by decades. The 2008–09 innovation is the **game-theoretic protocol** that makes honest behavior the dominant strategy and cheating economically irrational.
- **What blockchain can vs. cannot do.** It *can* give integrity, ordering, ownership, and public verifiability. It *cannot* verify real-world identity, enforce legal judgments, evaluate work quality, or guarantee safety/privacy on its own.
- **Transparency vs. privacy.** A public ledger is great for accountability and fatal for privacy — removing names does not stop inference.
- **Decentralization vs. institutional trust.** Most "decentralized" designs still depend on something centralized (an oracle, a DID method, a trusted issuer, a legal framework). Decentralization is rarely total.

**Quotable framings (Martina):** *"Either you follow the protocol or you gain nothing; if you cheat, you lose everything."* · *"Security depends on the weakest component."* · *"A wallet is a public key / a private key."* · *"Identification doesn't mean de-anonymization."* · *"Immutability is enforced by cost, not impossibility."*

---

## 1. Foundations & the three pillars

*What to know:* why blockchain exists, what problem decentralization solves, and the three pillars that keep a crypto system stable.

- **Distributed ledger** = a 6,000-year-old accounting technology (the ledger) in a distributed-computing form. A blockchain is its digital, decentralized version.
- **The decentralization problem** = run a shared, ordered, tamper-proof record with **no central authority** and **adversarial participants**. Three sub-problems: **identity** (who is who without a registry), **integrity** (history can't be reordered/altered), **ownership** (only the rightful owner can spend).
- **Trustless** = trust is placed in mathematics and protocol rules, **not absence of trust**. *"Is it easier to break SHA-256 or to corrupt a banker?"*
- **Nothing is new:** data structures/linked lists (1950s), hashes (1960s), public-key crypto (1977, secretly 1972), P2P networking (1994), commitments (1980s), ZKPs (~2004). The **game-theoretic glue** is the genuine novelty.
- **E-money vs. cryptocurrency:** David **Chaum's blind signatures** gave strong anonymity but **required a trusted central issuer**. Cryptocurrency replaced that central trust with **decentralization**.

**The Three Pillars (memorize — likely exam item):**

| Pillar | What it guarantees |
|---|---|
| **History / Integrity** | Recorded events cannot be altered retroactively (immutability). |
| **Rules** | Protocol rules (consensus, contract logic) govern what can and cannot happen. |
| **Value / Incentives** | Participants have an economic reason to follow the rules. |

> If any one pillar weakens, the whole system shakes. Designing **incentives is hardest for non-financial** applications.

**Stablecoins & programmable money (light touch — from the stablecoins event):**
- **Stablecoin** = a cryptocurrency holding **1:1 parity** with a fiat currency (e.g., USDT, USDC, a BRL stablecoin).
- **Programmable money** = money that carries embedded logic — a payment can auto-split into investments via smart contracts. *"PIX makes money circulate better; stablecoins make money function as software."*
- **PIX vs. stablecoin:** not rivals — different layers of one stack. PIX moves **balances** (fiat on/off-ramp, domestic, bank-day settlement); a stablecoin moves **logic** (programmable, 24/7, global). PIX is the on-ramp into the on-chain world.
- **Tokenization** = converting any asset of value (real estate, livestock, receivables) into fractional, transferable on-chain tokens.
- **Drex (Brazil's CBDC) was cancelled** because public-blockchain properties are fatal for a central bank: **no transaction privacy, no central control of wallet balances, hard to regulate** — features for crypto, dealbreakers for a CBDC.

---

## 2. Cryptographic primitives

*What to know:* the handful of primitives blockchains are built from, what problem each solves, and the named properties. *"Crypto"currency is built on cryptography; security is only as strong as the weakest primitive.*

**The primitives → the problem each solves (taxonomy):**

| Primitive | Provides |
|---|---|
| **Cryptographic hash function** | Integrity & data linking |
| **Digital signature** | Ownership & authentication |
| **Randomness / entropy** | Key security |
| **Consensus** | Distributed agreement |
| **Zero-knowledge proofs** (increasingly) | Privacy |

- **Hash function** = maps an **arbitrary-size input → fixed-size output**, infeasible to reverse. Same input always → same output. *"Chews information, spits out a fixed-size value."*
- **Three hash security properties (high-yield):**
  - **Pre-image resistance** — given a hash, can't find the input. (Underpins PoW mining.)
  - **Second-preimage resistance** — given input A, can't find a different B with the same hash. (Stops document substitution.)
  - **Collision resistance** — can't find *any* two inputs with the same hash. (Hardest to guarantee.)
- **Avalanche effect** = flipping one input bit changes ≥50% of output bits, unpredictably. **A feature, not a bug.**
- **Collisions exist (inevitable) ≠ collision attacks are feasible (engineered).** The danger is *engineering* a collision, not its existence (birthday paradox).
- **Digital signature** = sign with the **private key**, verify with the **public key**. Gives **authentication + integrity + non-repudiation** (signer can't later deny it).
- **Symmetric vs. asymmetric:** symmetric = one shared key (problem: must pre-share it). Asymmetric = public/private key pair, no pre-shared secret. **Direction matters:** encrypt-with-public = confidentiality; encrypt/sign-with-private = authentication.
- **Randomness / entropy:** weak randomness → predictable keys → broken system. **TRNG** (true, physical noise, high quality, low volume) seeds a **PRNG** (expands seed into usable material). Reusing a **nonce** in ECDSA leaks the private key. Real failures: Brazilian voting machines, PlayStation Network, Bitcoin wallets.
- **Zero-knowledge proof (ZKP)** = prove a statement is true **without revealing the underlying data** (e.g., prove age > 18 without showing your birthdate). Not required for a basic blockchain; critical for privacy.
- **Quantum threat:** a *cryptographically relevant* quantum computer would break **RSA and elliptic-curve** crypto. Hash functions are far more resistant (collision space 2²⁵⁶ → 2¹²⁸, still safe). **Crypto agility** = ability to swap algorithms. Government roadmap: post-quantum PKI ~2027, all systems ~2030, RSA/ECDSA retired ~2035.

**ECDSA vs. RSA (conceptual only — no math):**

| | RSA | ECDSA (elliptic curve) |
|---|---|---|
| Hard problem | Prime factorization | Elliptic-curve discrete log |
| Key size for ~same security | ~2048 bits | ~256 bits |
| Quantum resistance | Lower | Higher (needs more qubits), but still breakable |
| Used in blockchain for | — | Signing transactions (Bitcoin: secp256k1) |

---

## 3. Data structures & wallets

*What to know:* how primitives compose into the blockchain data structure, the two value models, and how wallets/keys/custody work. *"Blockchain = system design, not a crypto invention; security is emergent from composition."*

- **Blockchain (as a data structure)** = a **linked list with hash pointers** plus economic constraints. Properties: **append-only, practically immutable, globally verifiable**.
- **Hash pointer vs. normal pointer:** a normal pointer points to a location (tampering undetectable); a **hash pointer** points to content *and* includes its hash, so any change is detected and **breaks the whole chain forward**.
- **Immutability is economic, not absolute** = you *can* change a block, but you must recompute every later block's hash and redo the consensus work. **Cost grows with chain length.** *"Enforced by cost, not impossibility."*
- **Block structure:** *header* (previous-block hash, **Merkle root**, timestamp, nonce) gets hashed; *body* (transactions) is protected indirectly via the Merkle root.
- **Merkle tree** = a binary hash tree; leaves = transaction hashes, each parent = hash of its children, top = **Merkle root**. A **Merkle proof** verifies a transaction's inclusion in **O(log n)** instead of O(n) — enables light clients.
- **Blockchain as a state machine:** each transaction takes state S → S′. *"Computation over state, not just storage."*
- **Double-spending** = trying to spend the same funds twice; prevented by a single agreed history (ordering + consensus).
- **Wallet ≠ account.** *Public key = account (address, where funds sit); private key = wallet (control).* The blockchain holds the money; the wallet holds the **key**. **Lose the private key → funds gone permanently** (no recovery). *"Who owns the keys owns the asset."*
- **Seed phrase (BIP32 / BIP39)** = one master secret that deterministically derives all keys (hierarchical deterministic wallet). Convenient, but a **single point of failure** — needs high entropy.
- **Self-custody is hard and risky;** most users should prefer custodial services. **Risk moves from protocol → user (self-custody) or institution (custodial).**

**Value model — UTXO vs. Account (high-yield):**

| | UTXO model | Account model |
|---|---|---|
| Value as | Discrete unspent outputs (consume inputs, create outputs) | A global address → balance mapping |
| Balance | Sum of your UTXOs (no global balance) | Stored directly |
| Feel | Simpler, easier to parallelize | More intuitive, harder to parallelize |
| Used by | Bitcoin | Ethereum |

**Wallet taxonomy:**

| Axis | Option A | Option B |
|---|---|---|
| Connectivity | **Hot** (online, convenient, less secure) | **Cold** (offline, secure, less convenient) |
| Custody | **Custodial** (3rd party holds keys, easy onboarding, counterparty risk) | **Non-custodial / self-sovereign** (you hold keys, full responsibility) |

- **Distributed key control:** **multisig (m-of-n)** needs m of n keys to authorize; **MPC** signs without ever reconstructing the full key. *"Security becomes a protocol, not just a key."*
- **Where systems actually break:** usually **not** the cryptography — phishing, malware, social engineering. *"The user is the weakest link; system security ≠ cryptographic strength."*

---

## 4. Consensus & Sybil resistance

*What to know:* why consensus is needed, the three mechanism families, and what resource each uses to resist Sybil attacks. *"Consistency is not given, it is enforced."*

- **Consensus problem:** independent nodes + network delays → conflicting views and competing blocks. Consensus provides **ordering, conflict resolution, shared state** → converge on one history.
- **Sybil problem:** one entity can cheaply create many fake identities, so **vote-by-identity is unfair**. Consensus fixes the fairness criterion to a *scarce resource*.
- **Longest-chain rule (PoW):** on a fork, the chain with the **most accumulated work** wins; the shorter chain is discarded.
- **Finality:** PoW = **probabilistic** (never 100% final, just increasingly unlikely to reverse); BFT = **deterministic / instant**.
- **Alternative structures:** beyond a linear chain, **DAG / hashgraph** allow parallel blocks and higher throughput. *"Structure defines performance limits."*

**PoW vs. PoS vs. BFT (the core comparison — expect this):**

| | Proof of Work | Proof of Stake | BFT |
|---|---|---|---|
| Scarce resource | Computation / energy | Staked capital | Identity / reputation |
| How you win the right | Solve a hash puzzle (nonce → hash below target) | Selected proportional to stake | Known validator set votes |
| Cost of cheating | Wasted energy, low success odds | **Slashing** (lose stake) | Loss of standing |
| Finality | Probabilistic | Economic + finality rules | Instant, deterministic |
| Main risks | High energy, mining centralization | Stake concentration, governance capture | Limited scalability, not permissionless |

> **"The resource that secures the system also shapes its politics."** Security ≠ moral virtue — it's expected cost vs. reward.

---

## 5. Cryptocurrency resilience & regulation

*What to know:* why crypto networks survive crises, how forks resolve disputes, and how regulation reshapes (rather than kills) the ecosystem.

- **Why are cryptocurrencies still alive?** Exchanges collapsed but **protocols survived**; governments banned but **networks adapted**; communities split but **ecosystems continued**. Resilience is **sociotechnical**, not purely technical.
- **Four resilience layers:** **Technical** (consensus, cryptography, redundancy) · **Social** (governance, community, devs) · **Economic** (incentives, scarcity, liquidity) · **Regulatory** (adaptation, compliance, institutional adoption). Failure in one can propagate.
- **Resilience trinity:** consensus on **Rules** (what's valid), **History** (what happened), **Value** (why it matters). A coin fails only when **all three collapse at once**; most crises hit one pillar and the others compensate.
- **Governance is technical *and* political.** *"Code is law only when people agree code matters."* Changes flow via **BIPs / EIPs** → debate → client implementation → adoption by miners/validators/users/exchanges.
- **Foundations of value:** scarcity, credible rules, liquidity, utility, convertibility, market confidence. **Scarcity alone ≠ value** — useless scarcity is worthless.
- **Bitcoin halving** = issuance cut in half ~every 4 years (50→25 BTC in 2012), toward a 21M cap. Predictable scarcity → value expectations. **Not** an invulnerability shield (volatility remains).
- **51% attack is an economics problem, not just a vuln:** large networks are too expensive to attack; even a "successful" attack can collapse the token's value → **self-defeating**.
- **Stablecoins are bridges, not outside finance** — they reduce volatility but reintroduce **issuer, reserve, and regulatory risk**.

**Rule fork vs. History fork (high-yield distinction):**

| | Rule fork | History fork |
|---|---|---|
| Question | "What should the protocol *become*?" | "Should we accept or *rewrite* what happened?" |
| Trigger | Disagreement on future validity rules | Disagreement on accepting past events |
| Example | **Bitcoin Cash** (bigger blocks) split from Bitcoin | **Ethereum vs. Ethereum Classic** after the **DAO hack** |

**The DAO hack (the philosophical case study):** a contract bug let ~$50M (≈1.92M ETH) be drained. The code did exactly what it said but violated community expectations. **Ethereum (majority) hard-forked to reverse it; Ethereum Classic kept the original immutable history.** Lesson: *immutability is a social commitment; "code is law" is an ideology, not physics.*

**Antifragility** = improving *through* stress (not just resisting it). Crises expose weak points → community strengthens infrastructure:

| Crisis | Weakness exposed | Ecosystem response |
|---|---|---|
| **Mt. Gox (2014)** | Centralized custodian | Hardware wallets, multisig, self-custody, DEXs |
| **DAO hack (2016)** | Contract governance / immutability | Audits, upgradeable contracts, governance frameworks |
| **FTX (2022)** | Centralized exchange opacity | Proof of reserves, transparency, stronger regulation |

**Regulation:** arrives when a system is **too big to ignore**; it **reshapes** (custody, compliance, market access) rather than killing resilient systems.

| Region | Approach |
|---|---|
| **EU** | **MiCA** — harmonized single-market framework |
| **US** | Fragmented, enforcement-driven (SEC/CFTC/FinCEN/…) |
| **Asia** | State-led **CBDC** experimentation |

- **FATF Travel Rule** = identity info must accompany crypto transfers (like wire transfers) → exchanges collect KYC; ecosystem becomes "identity-aware" though the protocol stays pseudonymous.
- **Institutional-adoption paradox:** crypto was built to reduce institutional dependence, yet **ETFs, custodians, and proof-of-reserves now reinforce its legitimacy.** Resilience grows through **diversity, not purism.**

---

## 6. DeFi & on-chain finance

*What to know:* DeFi **transforms** intermediation into protocol rules; it does **not** eliminate finance's old risks — it makes them faster and composable. *"Stablecoins make money programmable; DeFi makes financial functions programmable."*

- **Core shift:** traditional finance asks **"Who are you?"** (credit, KYC); DeFi asks **"What collateral did you post?"** It removes **identity gatekeeping** but adds **collateral gatekeeping**. Risk moves **bank risk → protocol risk**.
- **DeFi stack (bottom→top):** settlement chain → smart-contract layer → token/stablecoin layer → **oracle & liquidity** layer → wallet/UI layer → governance layer.
- **Smart contract as financial state machine:** holds assets, enforces rules deterministically, computes ratios/liquidations. **In DeFi the contract *is* the machine** (not paperwork) — a bug is live financial infrastructure instantly.
- **Liquidity** = ability to trade/borrow/settle with low price impact. **"No liquidity, no DeFi — just code waiting for money."** A protocol can work technically but fail economically without it.
- **TVL (Total Value Locked):** measures capital deposited / relative protocol size. **Does NOT tell you:** volume, revenue, real usage, security, or health. Inflatable by incentives, leverage loops, double-counting. *"Tells you how much money is inside, not whether the machine is healthy."*
- **Oracle** = bridge bringing external data (prices, FX) on-chain. **Oracle failure (manipulation, staleness, downtime) = protocol failure.** *"DeFi is only as decentralized as the data it depends on."*
- **DEX** = swap tokens from your wallet via smart contracts, no custody/KYC. New risks: contract bugs, shallow liquidity, **MEV**, interface risk.
- **AMM & liquidity pool:** trade against a pool priced by a formula instead of an order book. **Constant product invariant: x · y = k** — as one asset gets scarcer in the pool, its price rises automatically. The formula gives automatic pricing, **not infinite liquidity**.
- **Overcollateralization:** borrow less than you post (e.g., 200 in ETH to borrow 100 USDC) — protects lenders since there's no credit check.
- **Health factor** = collateral value ÷ borrowed value. **> 1 safe; approaching 1 → liquidation.** A **liquidation** lets a liquidator repay your debt and take your collateral at a discount — *"the protocol protecting itself from your optimism."*
- **MEV (Maximal Extractable Value)** = value extracted by **ordering transactions** (front-running, sandwich attacks). *"Transaction ordering has economic value."*
- **Composability** = protocols/tokens plug into each other (LP token → collateral elsewhere). **DeFi's superpower (rapid innovation) and its attack surface (contagion).**
- **Hybrid finance** is the realistic future — not pure DeFi or pure CeFi, but a mix (DeFi rails + custodians + KYC + banks).

**Slippage vs. Impermanent loss (commonly confused — expect it):**

| | Slippage | Impermanent loss |
|---|---|---|
| Who it hits | The **trader** | The **liquidity provider** |
| What it is | Gap between expected and actual execution price | LP ends up worth less than if they'd just **held** the assets |
| Cause | Trade moves pool balance mid-trade; worse for big trades / shallow pools | Pool rebalances as relative prices change, forcing sells at bad ratios |

**What DeFi does NOT do (honest scope):** does not eliminate intermediation (transforms it), not create infinite liquidity, not remove volatility, not guarantee safety, not erase leverage/collateral/solvency risk, not create free yield. *"DeFi makes finance's old problems programmable, composable, faster, and sometimes more dangerous."*

---

## 7. Privacy & anonymity

*What to know:* the precise privacy vocabulary, why a public ledger leaks even without names, and the workaround-vs-by-design split. *Bitcoin is **pseudonymous, not anonymous.***

**Privacy vocabulary (the definitions question):**

| Term | Meaning |
|---|---|
| **Privacy** | Control over what others can learn about you |
| **Anonymity** | Actions can't be tied to your real identity at all |
| **Pseudonymity** | Actions tie to a stable identifier that isn't your legal name (what public blockchains give) |
| **Unlinkability** | Different transactions can't be confidently attributed to the same actor |

- **Why removing names fails:** the ledger still exposes the **transaction graph, amounts, timing, and repeated patterns**, and it's persistent + globally searchable. **Deleting identifiers ≠ stopping inference.** Privacy is harder than "don't store names."
- **Unlinkability > "is it anonymous?"** Real privacy is about how hard it is to **link behavior**, not whether names are shown.
- **Leaks in Bitcoin's UTXO model:** the **multi-input heuristic** (inputs signed together likely share an owner) and **change outputs** reveal wallet clusters.
- **Four-stage deanonymization:** ① transaction-graph clustering → ② wallet grouping → ③ metadata correlation → ④ **off-chain identity resolution** (exchange KYC, posted donation addresses, merchant data, IP logs, reused public profiles). *"The ledger alone may not identify you; the ledger + the real world often does."* One linking point exposes past and future activity.
- **Anonymity set** = number of plausible actors a transaction could belong to. Bigger = stronger, **but size alone isn't enough** — bad timing, side channels, and off-chain leaks shrink it. Good systems **maximize observer uncertainty**.
- **Tornado Cash** = zk-SNARK mixer; proved strong privacy is possible, then drew **sanctions/arrests** → privacy in blockchain is a **legal/governance** turning point, not just a technical one.

**Privacy-by-workaround vs. privacy-by-design:**

| | Approach | Examples | Assessment |
|---|---|---|---|
| **Workaround** | Public ledger + privacy tool on top | **Centralized mixers (Mixcoin)**, **CoinJoin** | Operationally useful, structurally fragile |
| **By design** | Privacy built into the protocol | **Monero**, **Zcash** | Cryptographically/structurally sound |

- **Centralized mixer vs. CoinJoin:** a **mixer** takes custody and you must trust it not to log/steal/cooperate; **CoinJoin** combines many users' inputs/outputs into one jointly-signed tx — **no custody, no central party** — but still leaks via timing/output structure.
- **Monero (privacy by default, mandatory):** **ring signatures** hide the sender, **stealth addresses** hide the receiver, **RingCT** hides the amount → every tx looks like many others, defeating heuristics.
- **Zcash (selective transparency):** **T-addresses** = transparent (Bitcoin-like); **Z-addresses** = shielded via **zk-SNARKs** (prove a tx is valid without revealing sender/receiver/amount). ZKPs shift privacy **from hiding data to proving correctness**.

---

## 8. Self-Sovereign Identity (SSI)

*What to know:* the shift from accounts to provable claims, the trust triangle, and what blockchain does (and doesn't) add to identity.

- **The shift:** from **"Who are you?"** (database/account lookup) to **"What can you prove?"** (verifiable claims you hold). Trust moves from an institution's database to a **cryptographic signature + issuer reputation**.
- **Why SSI exists:** the internet (TCP/IP) solved communication, **not identity**; Web 2.0 fixed usability via Google/Meta logins but created **identity monopolies & surveillance** (every login is tracked).
- **Verifiable Credential (VC)** = a signed, portable, machine-verifiable claim. Enables **selective disclosure** (prove age > 18 without revealing birthdate), portability, and **verification without calling the issuer every time** (asynchronous trust).
- **Decentralized Identifier (DID)** = `did:method:identifier`, resolving to a DID Document (public keys, endpoints). **DIDs don't automatically decentralize** — if the method depends on one institution, centralization remains. *Tools, not solutions.*
- **Identity vs. attribute credentials:** identity credential **identifies** (passport, national ID); attribute credential **qualifies** (student status, degree, age). SSI's power = **decomposing identity into reusable attributes**.
- **Credential lifecycle:** issue → store → present → verify → **revoke** → renew/reissue. **Revocation** matters because status changes (graduation, fraud), and verifiers can't call the issuer each time.
- **Blockchain's role in SSI** = a public, timestamped, tamper-resistant **revocation/trust root**. It does **not** solve semantic meaning or legal recognition. **Blockchain is optional** — SSI also works with trusted lists/wallets. (*Revocation paradox:* public revocation also leaks timing and invites coercion.)
- **Interoperability is "the real battlefield":** **technical** (common formats, W3C VCs) < **semantic** (a Brazilian "course level" ≠ a Spanish one) < **legal** (mutual recognition across countries). Blockchain can't fix the semantic/legal layers.
- **eIDAS2 (EU)** = regulation mandating digital-identity wallets; trust root is the **EU legal framework + trusted issuer list**, *not* blockchain consensus → real adoption is driven by **law and institutions**.

**The SSI trust triangle (memorize):**

| Actor | Role |
|---|---|
| **Issuer** | Creates and **signs** credentials (e.g., a university) |
| **Holder** | Stores credentials, controls what to present (the student) |
| **Verifier** | Checks signature, status, and issuer authority (an employer) |

> The verifier checks the issuer's **public key / revocation status**, not the holder's database record. SSI decentralizes *some* trust, **not all** — issuer governance and schemas remain institutional.

**Architecture choices:**

| Model | Trust root | Best for |
|---|---|---|
| **Public blockchain** | Ledger consensus | Shared public state, censorship resistance |
| **Trusted list / permissioned** | Legal authority | Regulated sectors, cross-border legal recognition |
| **Hybrid** | Wallet + ledger/list + institutions | Most practical real-world adoption |

---

## 9. Smart contracts on the EVM

*What to know:* a smart contract is a public, deterministic state machine with money attached; why determinism is mandatory; and the conceptual pitfalls. *(Conceptual only — no Solidity syntax.)*

- **Smart contract** = a program deployed at a blockchain address that holds state and exposes functions, runs in the **EVM**, can hold/move assets. **Not a backend service — a public state machine with money attached.** Code and state are publicly readable.
- **Smart contract vs. natural-language contract:** code is **deterministic** — its interpretation is fixed *before* execution, eliminating ambiguity-driven disputes.
- **Determinism is the price of consensus:** every node must independently reach the **same result**, so the EVM avoids true randomness, external data, and time-dependent logic. The EVM is "boring on purpose."
- **EVM runs bytecode,** not Solidity (Solidity compiles to bytecode). State is **persistent and replicated** on every full node → **storage is expensive** (gas).
- **Gas** = the cost metric that limits computation/storage abuse; on real networks it costs real money (a simulator like Remix doesn't reflect that).
- **Access control is foundational, not decoration:** `msg.sender` (the verified caller) + `require` (guard that reverts on failure) are **security decisions**. Missing access control = "a public vandalism interface instead of a secure registry."
- **Immutability — feature and liability:** code can't be secretly changed (good), but **bugs can't be patched** in place (bad). Upgradeability needs complex proxy patterns. → testing/audits are not optional. (The **DAO hack** is the canonical "irreversible bug" example.)

**Transaction vs. read-only call (high-yield distinction):**

| | Read-only call (view) | Transaction (state-changing) |
|---|---|---|
| Changes chain state? | No | Yes |
| Needs signing + mining? | No | Yes (signed, included in a block) |
| Costs gas? | No (local) | Yes |
| Can revert? | — | Yes (all changes rolled back) |
| Used for | Querying balances/status | Transfers, registrations, updates |

**Conceptual gotchas (likely "what's wrong" question):**
- **`private` is not secret** — all on-chain data is readable by any full node; it only controls code-level visibility.
- **Events ≠ state** — events are off-chain logs for apps to listen to; contract logic can't read them.
- **`block.timestamp` is slightly manipulable** by miners — don't make it security-critical.

---

## How to import the Anki deck (`anki-deck.tsv`)

1. Open Anki → **File → Import** → choose `anki-deck.tsv`.
2. **Type:** Basic. **Fields separated by:** **Tab**.
3. Map **Field 1 → Front**, **Field 2 → Back**. Pick/create a deck (e.g., "INE5458").
4. Answers use `<br>` for line breaks — in Anki, tick **"Allow HTML in fields"** so they render as line breaks (not literal `<br>`).
5. Import. ~120–160 cards should load. Every card traces back to a bullet or table in this guide, so use the guide as the answer key.
