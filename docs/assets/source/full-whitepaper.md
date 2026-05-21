**TRUSTPAY ESCROW**

**A Stablecoin Smart-Contract Escrow Protocol for Cross-Border Freelance
Work**

Long Technical White Paper

*Version 1.0 --- A living document*

Augusto de Hollanda Vieira Guerner

Eduardo Gwoszdz De Lazari

João Pedro Schmidt Cordeiro

Micael Angelo Sabadin Presotto

INE5458 --- Blockchain and Cryptocurrencies Technologies

Universidade Federal de Santa Catarina

Partial Delivery 2 --- Technical White Paper

**Abstract**

International freelance work is now a global market, but the payment
infrastructure that supports it has not kept pace. Clients are reluctant
to pay before receiving work; freelancers are reluctant to deliver work
before payment is guaranteed. Centralized freelance platforms reduce
this friction, but only by becoming the custodian of the funds --- the
parties simply move their trust from each other to a private company.

This white paper proposes **TrustPay Escrow**, a payment protocol in
which funds are locked in an EVM-compatible smart contract before work
begins and released through milestone approval, predefined contract
rules, or hybrid dispute resolution. The contract is settled in
regulated, fiat-pegged **stablecoins** (USDC, USDT), so neither party is
exposed to cryptocurrency volatility while still benefiting from
programmable, transparent custody. The technical novelty is not the
acceptance of crypto payments: it is the combination of stablecoin
settlement, milestone-based escrow logic, a publicly auditable contract
state, and a dispute workflow designed specifically for small
cross-border service contracts.

The protocol does not require its own blockchain. It is deployable today
on existing Layer 2 networks using audited token standards, mature
wallet tooling, and event-indexing infrastructure. The document that
follows justifies why a blockchain is necessary for this use case rather
than a traditional database, specifies the smart-contract architecture
and state machine, defines the on-chain / off-chain data boundary, and
analyzes the security, scalability, and regulatory limitations honestly.
The goal is to convince a technical reader that the system is feasible
with present-day infrastructure and that blockchain is used precisely
where it adds trust, transparency, and programmable custody --- and
nowhere else.

***A note on this document***

*Following the example of the Ethereum white paper, this is intended as
a living document. It states the protocol's intent and design rather
than a frozen specification, and it is expected to be revised as the
design is validated against testnet deployment, audit feedback, and
pilot users. Section numbering and the roadmap are versioned
accordingly.*

**Contents**

**1. Introduction**4

**2. Problem Definition and Motivation**6

**3. Proposed Solution Overview**8

**4. Stakeholders, Entities, and Use Cases**9

**5. Why Blockchain Is Necessary**11

**6. Technical Architecture**13

**7. Smart Contract Design**15

**8. Data Model and Processing**18

**9. Security Model and Risk Controls**20

**10. Dispute Resolution Mechanism**22

**11. Scalability, Infrastructure, and Performance**24

**12. Innovation and Differentiation**26

**13. Business Model and Go-to-Market Connection**27

**14. Roadmap, Limitations, and Conclusion**28

Appendix A --- Index of Diagrams30

Appendix B --- Terminology30

Appendix C --- References and Inspiration31

# 1. Introduction

## 1.1 The problem in one paragraph

International freelance work has become genuinely global: a designer in
Brazil can be hired by a startup in Germany, a developer in Vietnam by
an agency in Canada. Yet the two parties usually do not know each other,
may never have spoken before the contract, are subject to different
legal systems, and carry **asymmetric risk**. A client who pays in
advance can lose the money if the work is never delivered. A freelancer
who delivers first can lose weeks of labor if the client refuses to pay.
Traditional cross-border payment rails --- international bank transfers,
card payments, money-transfer services --- are slow, charge layered
fees, and are difficult to reconcile across borders. The result is a
market that runs on uneasy trust.

## 1.2 Why existing solutions are incomplete

Centralized freelance marketplaces solve part of this by holding the
client's payment and releasing it on completion. This works, but it
relocates rather than removes the trust problem: users must now trust
the platform as the sole custodian of their funds and the sole, opaque
judge of their disputes. The platform's internal ledger is private; a
user cannot independently verify that the deposited funds still exist,
are not commingled, or are not frozen for reasons unrelated to the
contract. Fees are set unilaterally, and withdrawal can be delayed or
blocked by policy changes the user did not agree to. The escrow is real,
but it is *invisible* and *discretionary*.

## 1.3 The TrustPay Escrow thesis

Our core thesis is narrow and testable: **a stablecoin smart-contract
escrow can reduce the trust and settlement problems of cross-border
freelance work by locking funds transparently and releasing them through
programmable milestone rules.** Once a client deposits stablecoins into
the escrow contract, the release conditions are publicly defined and
executed by the network, not by a private company. The platform still
provides usability, support, and dispute facilitation, but it does not
secretly control the financial state of the escrow. We deliberately do
not claim that blockchain eliminates legal, identity, or
quality-evaluation risk; Section 5 and Section 14 are explicit about
what stays off-chain and what stays unsolved.

## 1.4 Target users

The protocol is designed for, in order of priority: independent
international freelancers and remote contractors; small businesses and
startups that hire talent globally; and small agencies that coordinate
several contractors. The common denominator is a recurring need to pay
or be paid across borders for milestone-based service work --- software
development, design, marketing, consulting, translation, and remote
operational support --- in amounts large enough to matter but too small
to justify lawyers and letters of credit.

## 1.5 Document structure

The remainder of this paper follows a backward-then-technical structure.
Section 2 defines the problem in detail. Section 3 presents the solution
as a complete product. Section 4 maps stakeholders and use cases.
Section 5 --- the pivotal justification --- argues why a blockchain is
necessary rather than a database. Sections 6 through 8 specify the
architecture, the smart-contract design, and the data model. Sections 9
and 10 cover the security model and dispute resolution. Section 11
addresses scalability and infrastructure. Sections 12 and 13 cover
innovation and the business model, and Section 14 closes with the
roadmap, honest limitations, and conclusion.

# 2. Problem Definition and Motivation

Before describing any technology, this section explains why the payment
problem is worth solving. The problem is not purely technical; it is
also economic and behavioral, and it decomposes into four linked issues.

## 2.1 The four dimensions of the problem

- **Trust.** Client and freelancer typically have zero prior
  relationship and no shared legal forum. Each must extend credit --- of
  money or of labor --- to a stranger.

- **Settlement.** Cross-border bank transfers and card payments are slow
  (days to clear), expensive (FX spreads plus fixed and percentage
  fees), and prone to reversal or chargeback long after the work is
  done.

- **Transparency.** On a centralized platform, neither party can
  independently verify that funds are held, untouched, and available.
  The custody ledger is private.

- **Dispute handling.** When the parties disagree about whether work was
  completed, resolution is opaque, slow, and final at the discretion of
  an intermediary with its own incentives.

## 2.2 The problem is behavioral, not only technical

It is important to state that this is fundamentally a **coordination
problem under uncertainty**. Each party would rationally prefer the
other to commit first. In game-theoretic terms, advance payment and
delivery-before-payment are both unstable equilibria for the
disadvantaged side. The function of an escrow is to remove the ordering
problem: both commitments become simultaneous and conditional.
Blockchain becomes relevant precisely because it can make that
conditional commitment *verifiable by both parties without a trusted
third party holding the money*.

## 2.3 Problem map

The table below summarizes each actor's fear, the current workaround,
and the limitation that remains --- the gap TrustPay Escrow targets.

  -------------------------------------------------------------------------
  **Actor**        **Core fear**      **Current          **Remaining
                                      workaround**       limitation**
  ---------------- ------------------ ------------------ ------------------
  **Client**       Pays in advance;   Use a centralized  Must trust the
                   work is never      platform that      platform as opaque
                   delivered.         holds funds.       custodian and
                                                         judge.

  **Freelancer**   Delivers work;     Ask for partial    Up-front payment
                   payment never      up-front payment;  shifts risk to
                   arrives or is      rely on reviews.   client;
                   reversed.                             chargebacks still
                                                         possible.

  **Both**         Slow, costly,      International      FX spreads, fees,
                   hard-to-track      transfer or card   multi-day delays,
                   settlement.        payment.           reconciliation
                                                         effort.

  **Both**         Disagreement over  Platform support   Opaque decision;
                   completion.        ticket / informal  no neutral,
                                      negotiation.       verifiable record
                                                         of approvals.
  -------------------------------------------------------------------------

*Table 1. Problem map of cross-border freelance payment.*

# 3. Proposed Solution Overview

TrustPay Escrow is **a complete web platform connected to an
EVM-compatible smart-contract escrow system** --- not merely a smart
contract. The product is described here from the user's point of view
first; the contract logic and architecture follow in Sections 6--8.

## 3.1 The user-facing flow

1.  A client creates an escrow agreement, selecting the counterparty,
    the stablecoin, and a list of milestones with amounts and deadlines.

2.  The client deposits the total amount; the smart contract locks the
    funds. The freelancer can independently verify on-chain that the
    funds exist and are locked before doing any work.

3.  The freelancer completes a milestone and submits it, attaching
    deliverables off-chain with a content hash recorded on-chain.

4.  The client reviews and either approves the milestone --- triggering
    an automatic release of that milestone's amount --- or requests
    changes / opens a dispute.

5.  If a dispute is opened, the disputed portion stays locked while the
    dispute workflow (Section 10) determines whether to pay the
    freelancer, refund the client, or split the funds.

![End-to-end escrow payment
flow](/tmp/trustpay_md/full_media/media/image1.png){width="5.833333333333333in"
height="1.6979166666666667in"}

*Figure 1. The end-to-end escrow payment flow, from deposit to release
or refund.*

## 3.2 What the platform abstracts away

Blockchain user experience is a real adoption barrier, so the platform
deliberately hides complexity. Wallet connection is guided; contract
states are translated into plain-language statuses ("Funds locked",
"Awaiting your approval", "In dispute"); gas costs are estimated and
explained before any signature; and business users get dashboards with
invoices and reporting rather than raw transaction hashes. Crucially,
the platform does not need to operate its own blockchain --- it deploys
on an existing chain or Layer 2 (Section 11).

## 3.3 High-level component view

At the highest level the system has five blocks: the web application;
the backend / API and off-chain database; the wallet and stablecoin
layer; the escrow smart contracts; and the indexer / off-chain storage.
Section 6 expands each of these and explains why each exists.

# 4. Stakeholders, Entities, and Use Cases

This section transforms the entities identified in the project's
Blockchain Canvas into a stakeholder analysis. The protocol involves six
core entities, each with a distinct incentive and responsibility.

  -----------------------------------------------------------------------
  **Entity**        **Incentive**              **Responsibility /
                                               on-chain role**
  ----------------- -------------------------- --------------------------
  **Client          Protection against         Signs the deposit and the
  (payer)**         non-delivery; funds        approval transactions. One
                    released only after        per base contract.
                    milestone approval.        

  **Freelancer      Verifiable proof that      Signs milestone-submission
  (payee)**         funds exist before work    transactions. One per base
                    starts; no chargeback      contract.
                    risk.                      

  **Escrow smart    None --- it is an          Holds locked funds,
  contract**        autonomous agent executing enforces state transitions
                    fixed rules.               and access control.

  **Arbitrator**    Earns a share of dispute   Signs the
                    fees for ruling fairly and dispute-resolution
                    promptly.                  transaction. Platform
                                               moderator or decentralized
                                               panel.

  **Stablecoin      Maintains the fiat peg and Operates the ERC-20 token
  issuer**          the value of its token.    (e.g. Circle/USDC,
                                               Tether/USDT). External
                                               party.

  **Network         Block rewards / fees of    Validate and finalize all
  validators**      the underlying chain.      escrow transactions. The
                                               platform runs no chain of
                                               its own.
  -----------------------------------------------------------------------

*Table 2. Core stakeholders, their incentives, and on-chain roles.*

## 4.1 Who signs transactions, who does not

A useful distinction is between entities that sign on-chain transactions
and entities that only consume off-chain services. The client,
freelancer, and arbitrator hold wallets and sign transactions; the
stablecoin issuer and validators participate in the chain independently
of the platform. The platform itself is mostly off-chain: it operates
the web application, indexer, and database, and it may hold a limited
administrative key (Section 9) --- but it cannot unilaterally move
escrowed funds.

## 4.2 Representative use cases

### Use case A --- Normal milestone delivery

A startup hires a developer for a three-milestone project. Funds for all
three milestones are deposited at creation. The developer submits
milestone one; the client approves; the contract releases milestone
one's amount automatically. The cycle repeats. No dispute is ever
opened. This is the expected majority path.

### Use case B --- Late delivery and refund

A freelancer misses a milestone deadline and stops responding. After the
deadline passes, the client triggers the deadline-refund path for the
unfunded or unsubmitted milestone, recovering the locked amount.
Already-approved milestones remain paid.

### Use case C --- Disputed delivery

A freelancer submits a milestone and marks it complete; the client
rejects it as not matching the agreed scope. The client opens a dispute,
paying a dispute fee and submitting evidence. The disputed amount stays
locked. An arbitrator reviews evidence from both sides and rules ---
pay, refund, or split. The contract executes the verdict (Section 10).

# 5. Why Blockchain Is Necessary

This is the pivotal section. The lecture material is explicit: if the
question "why blockchain?" cannot be answered convincingly by comparing
concrete alternatives, the project probably does not need a blockchain.
We take that test seriously and answer it directly.

## 5.1 The alternatives, and why each falls short

**A traditional database.** A centralized SQL database can absolutely
record escrow status, milestones, and approvals. What it cannot do is
remove the need to trust the company that controls the database. The
records can be edited, the schema can be changed, and the funds ---
which still sit in an ordinary bank account --- can be frozen or moved
by the operator. A database gives a record; it does not give custody
guarantees that both adversarial parties can verify.

**A traditional payment provider.** Bank transfers and card processors
move money well, but they cannot provide transparent, programmable
escrow between strangers in different jurisdictions without themselves
acting as the central custodian and arbiter. Card payments additionally
carry chargeback risk that can reverse a settled payment months later
--- catastrophic for a freelancer who has already delivered.

**A centralized freelance platform.** This is the closest existing
solution, and it works --- but as Section 1 argued, it only relocates
trust. The custody ledger stays private and discretionary.

## 5.2 What a smart contract changes

A smart contract changes the **trust model**, not merely the technology.
Once funds are deposited, the release rules are publicly defined in
deployed bytecode and executed by the network. The platform can provide
usability and support, but it cannot secretly alter the financial state
of the escrow. Specifically, the protocol relies on five properties that
the lecture identifies as the genuine value of blockchain:

- **Immutability ---** the deployed escrow rules and the history of
  deposits, approvals, and releases cannot be silently rewritten.

- **Decentralization ---** no single private party holds custody of the
  funds or can unilaterally decide their release.

- **Digital signatures ---** only the client can approve, only the
  freelancer can submit, only the arbitrator can resolve --- enforced
  cryptographically, not by policy.

- **Programmable token transfer ---** stablecoin movement is bound to
  milestone logic; payment is a consequence of an on-chain condition,
  not a manual instruction.

- **Transparent state ---** both parties, and only those parties when
  appropriate, can independently verify the escrow's exact state at any
  time.

## 5.3 Honest scope: what blockchain does not solve

Intellectual honesty is required here. Blockchain **does not** verify
the real-world identity of the parties, **does not** enforce a legal
judgment in any national court, and **does not** evaluate whether
delivered work is actually good. Those problems are handled off-chain
--- by optional KYC, by terms of service, and by the human arbitration
layer respectively. The contract executes a verdict; it never forms one
about subjective quality.

## 5.4 Feature comparison

Table 3 compares the four approaches across the dimensions that matter
for this use case.

  ----------------------------------------------------------------------------
  **Property**      **Bank        **Card /      **Centralized   **Blockchain
                    transfer**    PayPal**      escrow**        escrow**
  ----------------- ------------- ------------- --------------- --------------
  **Funds held      No            No            Yes             Yes
  conditionally**                                               

  **Custody         No            No            No (private     Yes (public
  verifiable by                                 ledger)         state)
  both parties**                                                

  **Release rules   No            No            Partial /       Yes
  programmable**                                opaque          

  **Chargeback /    Low           High          Medium          None on-chain
  reversal risk**                                               

  **Cross-border by Slow / costly Partial       Yes             Yes
  design**                                                      

  **Trust placed in Bank          Processor     Platform        None for
  a private                                                     custody
  custodian**                                                   
  ----------------------------------------------------------------------------

*Table 3. Comparison of escrow approaches. Blockchain escrow is
justified by verifiable custody and programmable release, not by
novelty.*

# 6. Technical Architecture

The system uses a **hybrid architecture**. Financial commitments and
state transitions that must be auditable live on-chain; everything else
--- large files, profiles, messages, identity data --- lives off-chain
for cost, privacy, and scalability reasons (the boundary is defined
precisely in Section 8). Figure 2 shows the four layers and how they
interact.

![System
architecture](/tmp/trustpay_md/full_media/media/image4.png){width="6.25in"
height="3.6354166666666665in"}

*Figure 2. Hybrid architecture: presentation, application services,
blockchain interaction, and the on-chain layer.*

## 6.1 The on-chain layer

The on-chain layer stores only what must be auditable: escrow creation,
deposits, milestone amounts, approvals, releases, refund decisions, and
dispute verdicts. It consists of the escrow smart contracts (Section 7),
the external stablecoin ERC-20 contract, and an optional oracle for
time-based unlock conditions. It is deployed on an EVM-compatible Layer
2; the protocol never operates its own blockchain.

## 6.2 The off-chain layer

The off-chain layer stores user profiles, business metadata, in-app
messages, KYC data where required, and deliverable files. It exists
because putting any of this on-chain would be prohibitively expensive,
would permanently expose private data, and would not benefit from
on-chain immutability. When a deliverable must be verifiable, the file
stays off-chain and only its cryptographic hash or IPFS content
identifier is anchored on-chain.

## 6.3 The application and presentation layers

The web application connects users to the escrow contracts through
wallet integrations and renders contract events as a readable interface.
The backend exposes a REST/GraphQL API, manages off-chain records, and
--- critically --- runs an event indexer that transforms raw on-chain
logs into fast queries for dashboards and notifications. Without an
indexer, every dashboard screen would require slow, repeated direct
calls to the blockchain.

## 6.4 Suggested technology stack

Each component below is chosen for maturity and ecosystem support; the
rationale, not just the name, is given.

  -----------------------------------------------------------------------
  **Layer**          **Suggested           **Why this choice**
                     technology**          
  ------------------ --------------------- ------------------------------
  **Smart            Solidity on an        Largest auditor pool, mature
  contracts**        EVM-compatible Layer  tooling, and audited token
                     2                     standards reduce security
                                           risk.

  **Frontend**       React / Next.js       Server-side rendering for fast
                                           load; rich wallet-connector
                                           libraries available.

  **Backend / API**  Node.js / NestJS      Shares the
                                           JavaScript/TypeScript
                                           toolchain with the frontend
                                           and Ethereum libraries.

  **Off-chain        PostgreSQL            Reliable relational store for
  database**                               profiles, metadata, and
                                           indexed event projections.

  **File storage**   IPFS or object        Content-addressed storage; the
                     storage               on-chain hash proves a file
                                           was not altered.

  **Event indexing** The Graph or a custom Converts contract logs into
                     indexer               queryable data so the UI never
                                           polls the chain directly.

  **Chain access**   ethers.js / viem +    Standard libraries for signing
                     RPC provider          transactions and subscribing
                                           to events.
  -----------------------------------------------------------------------

*Table 4. Suggested technology stack with rationale per component.*

## 6.5 Data flow

The canonical data flow is: create contract → deposit → submit
deliverable → approve or reject → release or refund. Each step is a
transaction that emits an event; the indexer consumes the event, updates
the off-chain projection, and the backend sends notifications. The user
interface therefore stays responsive while reflecting authoritative
on-chain state.

# 7. Smart Contract Design

The smart-contract layer is organized around two contract types: a
single **EscrowFactory** and many individual **Escrow** instances. This
section specifies the contracts in enough detail to convince a technical
reader that the logic is implementable and conservative.

## 7.1 EscrowFactory

The factory deploys new escrow instances and holds platform-wide
parameters: the fee receiver address, the platform fee rate, the set of
supported stablecoin addresses, and the address(es) authorized to act as
arbitrators. Centralizing these parameters in the factory means a new
escrow is created with correct, consistent settings and that the
supported-token allowlist (a security control, see Section 9) is
enforced at creation time.

## 7.2 Escrow instance state

Each Escrow contract stores: the client address, the freelancer address,
the stablecoin token address, an ordered list of milestones, the current
status, the deposited balance, per-milestone deadlines, and the dispute
status. Each milestone holds its own amount, deadline, state, and ---
once submitted --- the content hash of the deliverable.

## 7.3 Core functions and access control

The contract exposes the following functions. Access control is strict:
each function checks msg.sender against the role allowed to call it, and
against the current state.

  -------------------------------------------------------------------------------
  **Function**                **Who may call it**    **Effect**
  --------------------------- ---------------------- ----------------------------
  **createEscrow(\...)**      Client (via factory)   Deploys an escrow with the
                                                     parties, token, and
                                                     milestone list.

  **deposit()**               Client                 Transfers stablecoin into
                                                     the contract; locks funds;
                                                     moves milestones to Funded.

  **submitMilestone(id,       Freelancer             Marks a funded milestone as
  hash)**                                            Submitted and records the
                                                     deliverable hash.

  **approveMilestone(id)**    Client                 Approves a submitted
                                                     milestone, enabling release.

  **requestChanges(id)**      Client                 Returns a submitted
                                                     milestone to the freelancer
                                                     for rework.

  **releasePayment(id)**      Client or freelancer   Transfers an approved
                                                     milestone's amount (minus
                                                     fee) to the freelancer.

  **openDispute(id)**         Client or freelancer   Locks the disputed milestone
                                                     pending arbitration; records
                                                     a dispute fee/stake.

  **resolveDispute(id,        Arbitrator only        Executes the verdict: pay,
  verdict)**                                         refund, or split the
                                                     disputed amount.

  **refund(id)**              Client (after          Returns a
                              deadline)              funded-but-undelivered
                                                     milestone's amount after its
                                                     deadline.

  **cancelBeforeFunding()**   Client                 Cancels an escrow that has
                                                     been created but not yet
                                                     funded.
  -------------------------------------------------------------------------------

*Table 5. Core escrow functions, their authorized callers, and effects.*

## 7.4 The milestone state machine

Each milestone is a small, well-defined state machine. A milestone can
be Created, Funded, Submitted, Approved, Released, Disputed, Resolved,
or Refunded. Only legal transitions are permitted; for example, funds
can only be released from a milestone that is Approved or whose dispute
has been Resolved in the freelancer's favor. Figure 3 shows the complete
machine.

![Milestone state
machine](/tmp/trustpay_md/full_media/media/image3.png){width="6.25in"
height="2.7291666666666665in"}

*Figure 3. Milestone state machine. Only legal transitions are
permitted; disputed funds cannot leave the contract without a verdict.*

## 7.5 Emitted events

Every meaningful action emits an event so the off-chain indexer can
reconstruct state without trusting any intermediary. The events are:
EscrowCreated, FundDeposited, MilestoneSubmitted, MilestoneApproved,
PaymentReleased, DisputeOpened, DisputeResolved, and RefundIssued.
Dashboards, notifications, and reporting are all built from this event
stream.

## 7.6 Conservative design principles

The first implementation deliberately favors simplicity over feature
richness. It uses a small number of audited stablecoin interfaces,
applies the checks-effects-interactions pattern and a reentrancy guard
around every token transfer, and avoids speculative on-chain features.
Security rather than cleverness is the design priority --- the contracts
custody real money.

# 8. Data Model and Processing

The guiding principle is to store **only the minimum necessary data
on-chain**. Data that affects fund custody and must be auditable goes
on-chain; everything else stays off-chain. Putting the wrong data
on-chain is expensive, permanently public, and irreversible.

## 8.1 On-chain vs off-chain classification

  -----------------------------------------------------------------------
  **Data**                **Location**            **Why**
  ----------------------- ----------------------- -----------------------
  **Contract state,       On-chain                Determines fund
  milestone status**                              custody; must be
                                                  tamper-proof and
                                                  auditable.

  **Locked amounts,       On-chain                Directly control who
  approvals, dispute                              receives money; cannot
  verdicts**                                      be discretionary.

  **Deliverable file hash On-chain (hash only)    Proves the file was not
  / IPFS CID**                                    altered without storing
                                                  the file itself.

  **Deliverable files,    Off-chain               Too large and costly
  descriptions**                                  for on-chain storage.

  **Chat messages,        Off-chain               Operational data; no
  support tickets**                               custody impact;
                                                  immutability not
                                                  desired.

  **User profiles, KYC /  Off-chain               Private personal data
  identity data**                                 must never be public or
                                                  permanent.
  -----------------------------------------------------------------------

*Table 6. On-chain / off-chain data classification.*

## 8.2 Inputs and outputs

**On-chain inputs:** client and freelancer addresses, the token address,
milestone amounts and identifiers, approval or rejection signals, and
the dispute verdict. On-chain outputs: emitted events, state changes,
and stablecoin transfers.

**Off-chain inputs:** deliverable files, milestone descriptions, in-app
messages, identity data, and support tickets. Off-chain outputs:
dashboard projections, notifications, invoices, and reports.

## 8.3 Processing model

Processing is split cleanly. The smart contract executes the escrow
rules --- milestone checks, access control, and fund routing --- as
distributed, deterministic computation verified by the network's
consensus. The backend never computes custody decisions; it listens to
emitted events, updates dashboards, sends notifications, and manages
off-chain records. An optional oracle (e.g. Chainlink) can supply
real-world data such as a time-based unlock if a milestone needs an
automatic deadline action. This separation means a bug in the off-chain
code can never misdirect escrowed funds.

# 9. Security Model and Risk Controls

Because the platform controls financial flows, the contracts must be
designed conservatively and the risks must be acknowledged in full.
Risks fall into three groups: smart-contract risks, user risks, and
business/legal risks.

## 9.1 Smart-contract risks

The principal contract-level risks are logic bugs, reentrancy during
token transfers, incorrect access control, funds becoming permanently
stuck, and incorrect assumptions about a token's behavior (for instance,
fee-on-transfer or non-standard ERC-20 implementations). Mitigations
are: keeping the first version small and simple; using the
checks-effects-interactions pattern with an explicit reentrancy guard;
restricting supported tokens to a short, audited allowlist; and writing
exhaustive unit and integration tests before any mainnet deployment.

## 9.2 User risks

Users can lose funds in ways the contract cannot prevent: sending to a
wrong wallet address, falling for phishing sites, misunderstanding gas
fees, or losing their private keys. The product mitigates these with
guided onboarding, explicit confirmation screens before every signature,
prominently displayed and verifiable contract addresses, and
plain-language warnings --- but it states clearly that self-custody
carries irreducible user responsibility.

## 9.3 Business and legal risks

Beyond code, the protocol faces stablecoin-availability risk in some
jurisdictions, evolving compliance obligations, the legitimacy of
disputes, and chargeback exposure on the fiat on-ramp side (before value
becomes stablecoin). These are addressed through staged geographic
rollout, conservative compliance posture, and clear terms of service ---
and they are listed honestly among the limitations in Section 14.

## 9.4 Risk matrix

  --------------------------------------------------------------------------------
  **Risk**             **Impact**   **Likelihood**   **Mitigation**
  -------------------- ------------ ---------------- -----------------------------
  **Smart-contract     High         Medium           Independent audits, testnet
  bug**                                              pilot, bug bounty, minimal
                                                     logic.

  **Reentrancy on      High         Low              Checks-effects-interactions
  transfer**                                         pattern plus reentrancy
                                                     guard.

  **Wrong /            Medium       Low              Short audited allowlist
  non-standard token**                               enforced by the factory.

  **User key loss /    High         Medium           Guided onboarding, signature
  phishing**                                         confirmations, verified
                                                     addresses.

  **Stablecoin de-peg  High         Low              Support multiple issuers;
  / freeze**                                         monitor peg; clear user
                                                     disclosure.

  **Regulatory /       High         Medium           Staged rollout by
  compliance change**                                jurisdiction; conservative
                                                     compliance posture.

  **Admin-key          High         Low              Multisig admin control;
  compromise**                                       tightly scoped, transparent
                                                     admin powers.
  --------------------------------------------------------------------------------

*Table 7. Risk matrix with impact, likelihood, and mitigation.*

## 9.5 Administrative powers and upgradeability

Administrative capabilities exist for genuine operational needs ---
pausing new escrow creation in an emergency, updating the
supported-token allowlist as new audited stablecoins emerge, adjusting
the platform fee within its hard-coded maximum, and rotating the fee
receiver address. These powers are held by a 3-of-5 multisig wallet,
never a single key. The five signers are drawn from independent roles
(e.g. founding team, legal counsel, an external advisor, a security
partner, and a dedicated operations key held in cold storage) so that no
single individual or organizational faction can act unilaterally. Two
further controls bound this power:

- Scope limitation. The admin role can never seize, redirect, freeze, or
  modify the balance of any individual escrow. Funds already locked in
  an existing Escrow instance are governed exclusively by that
  instance\'s deployed code and the cryptographic signatures of its
  client, freelancer, and assigned arbitrator. There is no admin
  function that takes an escrow address as a parameter.

- Timelock. All non-emergency admin actions --- fee changes, allowlist
  additions, fee-receiver updates --- are subject to a 48-hour on-chain
  timelock between proposal and execution. This window gives users time
  to observe pending changes (the proposed action is publicly visible)
  and, if they object, to settle and withdraw from any active escrow
  before the change takes effect. The emergency pause is exempt from the
  timelock but can only stop new escrow creation; it cannot affect
  existing escrows.

Upgrade policy is conservative: individual Escrow instances are
non-upgradeable proxies-less contracts so that users\' locked funds are
governed by exactly the bytecode they agreed to. The EscrowFactory
itself is upgradeable through the same multisig + timelock process, but
factory upgrades affect only escrows created after the upgrade --- never
retroactively. This design treats the admin role as a careful operator
of shared infrastructure, not as a custodian of user funds, and it
should be acknowledged in Section 5.3 as one of the residual trust
assumptions the protocol does not fully eliminate.

# 10. Dispute Resolution Mechanism

Not every freelance deliverable can be judged by code --- a contract
cannot decide whether a logo is "good". The protocol therefore uses a
**hybrid dispute model**: the smart contract enforces that disputed
funds stay locked, while the decision itself comes from a human or
decentralized arbitration layer. Figure 4 shows the flow, with locked
funds as the central, stable state.

![Dispute resolution
flow](/tmp/trustpay_md/full_media/media/image2.png){width="6.25in"
height="2.6666666666666665in"}

*Figure 4. Dispute resolution flow. The contract holds the funds; the
arbitration layer decides; the contract executes the verdict.*

## 10.1 Opening a dispute

Either party may open a dispute on a submitted milestone before an
approval deadline expires. Opening a dispute requires paying a dispute
fee or posting a stake, and submitting evidence --- typically off-chain
files referenced by an on-chain hash. The fee/stake exists to discourage
frivolous disputes; it is partially refundable to the party the
arbitrator rules in favor of.

## 10.2 Resolution outcomes

An arbitrator can return one of three verdicts, which the contract then
executes: pay the freelancer the full milestone amount; refund the
client the full amount; or split the funds in a stated proportion. Where
the product supports it, a fourth path --- request rework --- can return
the milestone to the freelancer instead of a final verdict.

## 10.3 Anti-abuse controls

- **Dispute fee / stake ---** a real cost to opening a dispute deters
  bad-faith filings.

- **Reputation impact ---** dispute outcomes feed an off-chain
  reputation signal visible to future counterparties.

- **Evidence requirement ---** a dispute with no submitted evidence can
  be summarily resolved against the opener.

- **Escalating penalties ---** repeated bad-faith disputes from the same
  account incur progressively larger fees or stakes.

## 10.4 Evolution: from managed to decentralized arbitration

The first version uses **platform-managed arbitration** --- trained
moderators --- for simplicity and speed. Later versions can integrate a
**decentralized arbitration protocol** such as Kleros, where a randomly
selected, economically incentivized juror panel rules, improving
neutrality and scalability. The protocol is honest that the early system
is moderated by the platform; it does not claim total decentralization
it has not yet earned. In every version, the contract executes the
verdict but never judges work quality itself.

# 11. Scalability, Infrastructure, and Performance

The platform **does not require its own blockchain**. It deploys on an
EVM-compatible Layer 2 with low transaction costs and stablecoin
support. This choice reduces development complexity while preserving the
security and transparency of smart contracts.

## 11.1 Why a Layer 2

A Layer 2 network is preferable for three concrete reasons: transaction
fees are low enough that paying a fee per milestone does not erode small
contracts; confirmation is fast enough for a responsive user experience;
and wallet tooling, stablecoin deployments, and indexers already exist
on major L2s, so no custom infrastructure is needed. Building a
dedicated chain would add enormous cost and security burden for no
proportionate benefit.

## 11.2 Where the real scalability challenge lies

Each escrow produces only a small, bounded number of transactions --- a
deposit, a few submissions and approvals, perhaps a dispute. The system
is therefore **not** computation-heavy. The actual scaling challenge is
a high number of **concurrent** escrows generating events, plus the
indexing, notification, and dashboard-query load that comes with many
simultaneous users. That load is an off-chain engineering problem,
solved with standard techniques.

## 11.3 Blockchain latency vs application latency

The two must not be confused. Blockchain confirmation has inherent
latency; the web application does not have to inherit it. The UI shows
explicit pending-transaction states ("Deposit confirming...") and
updates optimistically once a transaction is broadcast, then confirms
when the event is indexed. The perceived experience stays smooth even
when on-chain finality takes seconds.

## 11.4 Indexing and caching

Users never query the blockchain directly for routine screens. The event
indexer maintains an off-chain projection of all escrow state;
dashboards and notifications read from that cached projection. Direct
chain reads are reserved for the moments a user explicitly wants to
verify state independently. Off-chain file storage further reduces cost
and protects privacy, since deliverables never touch the chain.

## 11.5 Performance assumptions

  ------------------------------------------------------------------------
  **Operation**             **On-chain tx      **Expected bottleneck**
                            count**            
  ------------------------- ------------------ ---------------------------
  **Create + fund an        2 (+1 token        L2 confirmation time;
  escrow**                  approval)          mitigated by pending-state
                                               UI.

  **Submit + approve a      2                  None significant at
  milestone**                                  expected volumes.

  **Release a payment**     1                  Token transfer cost;
                                               negligible on an L2.

  **Open + resolve a        2                  Human arbitration time, not
  dispute**                                    on-chain throughput.

  **Render dashboards (many 0 (indexed reads)  Indexer throughput and
  users)**                                     database query load.
  ------------------------------------------------------------------------

*Table 8. Performance assumptions per operation. The dominant cost is
off-chain indexing, not on-chain computation.*

# 12. Innovation and Differentiation

The innovation here is **not** simply accepting cryptocurrency payments.
It is the combination of four elements into
escrow-as-programmable-infrastructure: stablecoin settlement,
milestone-based escrow, a verifiable contract state, and a dispute
workflow built specifically for small cross-border service contracts.
Users can verify that funds are locked, milestones can be paid
independently, and the release logic is fixed before work starts.

## 12.1 Versus ordinary crypto transfers

A direct wallet-to-wallet stablecoin transfer is fast and cheap but
protects neither party: it is exactly as risky as a bank transfer with
no recourse. TrustPay Escrow adds the conditional, milestone-bound
custody that a raw transfer lacks.

## 12.2 Versus centralized freelance platforms

A centralized platform's interface helps users, and so does ours --- but
on a centralized platform the fund state is enforced by a private,
opaque ledger. Here it is enforced transparently by smart contracts the
parties can audit. The platform is a facilitator, not a custodian.

## 12.3 Versus banks and payment processors

Banks and processors are not programmable and are not cross-border by
design; escrow, where it exists, is a manual, jurisdiction-bound
service. TrustPay Escrow's escrow logic is programmable and cross-border
by default, and fees are collected transparently in stablecoin at the
moment of release.

## 12.4 Positioning

On a two-axis map of platform control (low to high) against custody
transparency (low to high), banks and centralized platforms sit in the
high-control, low-transparency quadrant; raw crypto transfers sit in the
low-control, low-protection quadrant. TrustPay Escrow targets the
high-transparency quadrant with only the minimum necessary platform
control --- and is candid that, until decentralized arbitration is
integrated, dispute resolution keeps the protocol from claiming the
extreme low-control corner.

# 13. Business Model and Go-to-Market Connection

Although this is a technical paper, the technical design must support a
viable business. This section maps the project's Business Model Canvas
onto the architecture and shows that the two are consistent.

## 13.1 Revenue streams

- **Transaction fee ---** a fee of roughly 0.5--1.5% on each completed
  escrow, collected transparently in stablecoin at release.

- **Business subscription ---** a paid tier for businesses with advanced
  features, priority support, and an SLA.

- **Dispute resolution fees ---** fees for premium arbitration, shared
  with arbitrators to incentivize fair, timely rulings.

## 13.2 Why the technical design supports the business

The architecture and the revenue model are aligned by construction.
Because the escrow contract already mediates every release, the platform
fee can be deducted at exactly that point --- collected automatically,
transparently, and in stablecoin, with no separate billing system and no
intermediary. Business accounts are simply richer off-chain dashboards
over the same on-chain escrows. The fee logic is a few lines in a
contract that already exists for custody reasons.

## 13.3 Cost structure

Key costs are: engineering salaries and cloud/node infrastructure;
smart-contract development and recurring security audits; node and API
providers; marketing and growth; user support; and compliance. Audits
and compliance are treated as non-negotiable line items, not optional
extras, because the protocol custodies user funds.

## 13.4 Channels and customer acquisition

The primary channels are the web platform itself, crypto wallet
integrations, and partnerships with fiat on/off-ramp providers that let
users enter and exit without deep crypto knowledge. Customer acquisition
focuses on communities of international freelancers, startup and
small-business communities, agencies, remote-work platforms, and
educational content explaining stablecoin payments to a non-crypto
audience.

# 14. Roadmap, Limitations, and Conclusion

## 14.1 Roadmap

Development is staged so that each phase depends on the verified success
of the previous one --- a deliberately dependency-driven plan, shown in
Figure 5.

![Roadmap
timeline](/tmp/trustpay_md/full_media/media/image5.png){width="6.25in"
height="2.3854166666666665in"}

*Figure 5. Roadmap timeline with explicit dependencies between phases.*

1.  **Phase 1 --- Proof of concept.** A testnet escrow contract, a basic
    web interface, and a complete flow from deposit to milestone
    release.

2.  **Phase 2 --- MVP / pilot.** Deployment on a low-cost L2 with real
    stablecoin support, an event indexer, and platform-managed dispute
    resolution.

3.  **Phase 3 --- Business tier.** Team accounts, invoices, reporting,
    and fiat on/off-ramp partnerships.

4.  **Phase 4 --- Hybrid arbitration.** Integration of a decentralized
    arbitration protocol alongside platform moderation.

5.  **Phase 5 --- Scale.** Multi-chain or cross-chain support and
    broader stablecoin coverage.

## 14.2 Honest limitations

Credibility requires stating what remains unsolved. The protocol depends
on legal and regulatory conditions that vary by country and are still
evolving. It carries stablecoin risk --- a de-peg or issuer freeze would
affect locked value. It cannot evaluate subjective work quality; that
always requires a human arbitrator. Smart-contract bugs remain possible
despite audits. And onboarding non-crypto users to wallets and gas is a
genuine friction that good product design can reduce but not eliminate.
None of these is hidden; each is mapped to a mitigation in Sections 9,
10, and this roadmap.

## 14.3 Conclusion

TrustPay Escrow applies blockchain **exactly where it adds value and
nowhere else**. Blockchain provides what the use case genuinely needs
--- verifiable custody, transparent state, and programmable release
between parties with zero prior trust --- while off-chain systems handle
usability, private data, and file storage, which they do better. The
protocol is feasible with present-day infrastructure: audited token
standards, EVM-compatible Layer 2 networks, mature wallet tooling, and
established indexing services. It requires no new blockchain and no
speculative technology.

The central thesis stands: **a stablecoin smart-contract escrow can
meaningfully reduce the trust and settlement friction of international
freelance work by locking funds transparently and releasing them through
programmable milestone rules.** It does not eliminate every legal or
operational risk --- and this paper has been careful never to claim that
it does. What it offers is a payment layer for cross-border service work
in which neither side has to trust a private intermediary blindly. That
is a concrete, buildable improvement, and it is the project we propose
to build.

# Appendix A --- Index of Diagrams

The following diagrams appear in this document and may be reused in the
short white paper and the pitch presentation:

- Figure 1 --- End-to-end escrow payment flow (Section 3).

- Figure 2 --- System architecture, on-chain and off-chain components
  (Section 6).

- Figure 3 --- Milestone state machine (Section 7).

- Figure 4 --- Dispute resolution flow with locked funds as the central
  state (Section 10).

- Figure 5 --- Roadmap timeline with dependencies (Section 14).

- Tables 1--8 --- problem map, stakeholders, escrow comparison,
  technology stack, escrow functions, data classification, risk matrix,
  and performance assumptions.

## Appendix B --- Terminology

The following terms are used consistently throughout this white paper:

  -----------------------------------------------------------------------
  **Term**            **Definition**
  ------------------- ---------------------------------------------------
  **Client**          The payer; the party that funds the escrow and
                      approves milestones.

  **Freelancer**      The payee; the party that performs the work and
                      submits milestones.

  **Escrow**          The smart contract that holds locked funds and
                      enforces release rules.

  **Milestone**       A defined unit of work with its own amount,
                      deadline, and state.

  **Locked funds**    Stablecoin held by the contract and not releasable
                      until conditions are met.

  **Approval /        Client confirmation of a milestone, and the
  Release**           resulting transfer to the freelancer.

  **Refund**          Return of locked funds to the client after a
                      deadline or dispute verdict.

  **Dispute /         A contested milestone, and the human or
  Arbitrator**        decentralized party that rules on it.

  **Stablecoin**      A fiat-pegged ERC-20 token (e.g. USDC, USDT) used
                      for settlement.

  **On-chain /        Data stored on the blockchain versus data stored in
  Off-chain**         conventional systems.

  **Event indexer**   A service that turns on-chain event logs into fast,
                      queryable off-chain data.

  **Wallet            The connection between a user's self-custody wallet
  integration**       and the platform.
  -----------------------------------------------------------------------

*Table B1. Consistent terminology for the white paper.*

## Appendix C --- References and Inspiration

This document follows the audience-targeted white-paper strategy taught
in INE5458 and adopts the living-document format of the Ethereum white
paper. Two canonical references informed its structure and tone:

- S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System" ---
  [[https://bitcoin.org/bitcoin.pdf]{.underline}](https://bitcoin.org/bitcoin.pdf)

- V. Buterin et al., "Ethereum White Paper" (living document) ---
  [[https://ethereum.org/en/whitepaper/]{.underline}](https://ethereum.org/en/whitepaper/)
