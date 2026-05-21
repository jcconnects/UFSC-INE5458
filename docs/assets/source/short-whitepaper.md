**TRUSTPAY ESCROW**

**A Stablecoin Smart-Contract Escrow for Cross-Border Freelance Work ---
Short White Paper**

A. de Hollanda Vieira Guerner · E. Gwoszdz De Lazari · J. P. Schmidt
Cordeiro · M. A. Sabadin Presotto \| INE5458, UFSC \| v1.0

**The Problem**

Freelance work is global, but its payment layer is not. Two strangers in
different countries and legal systems must agree to pay each other, and
**someone always has to go first**. If the client pays in advance, the
work may never arrive; if the freelancer delivers first, payment may
never come --- or be reversed later as a chargeback. Cross-border
transfers are slow and costly. Centralized freelance platforms hold the
money, but this only **relocates trust**: users must trust a private
company as the sole, opaque keeper of their funds and judge of their
disputes. They cannot verify the money is there, and fees and
withdrawals are set unilaterally.

**The Solution**

TrustPay Escrow is a web platform that locks payment in a
**smart-contract escrow** until work is delivered. The client deposits
the funds up front, but they are locked: the freelancer can verify
on-chain that the money exists before starting, and release happens only
on milestone approval --- so neither side goes first, and no private
party secretly controls the funds. Payments settle in **stablecoins**
(USDC/USDT, pegged 1:1 to the US dollar), giving fast, transparent,
programmable payments with no exposure to crypto volatility. The
platform hides blockchain complexity behind guided wallet setup and
plain-language statuses, and runs on existing low-cost networks --- no
new blockchain is needed.

![How it works in three
steps](/tmp/trustpay_md/short_media/media/36c91cffecb83cb584f2edbc9150c2165de2cf3d.png "How it works in three steps"){width="4.791666666666667in"
height="1.3020833333333333in"}

*Figure 1. Lock funds → deliver milestone → release payment.*

**Key differences:** the locked money is publicly verifiable by both
parties; release rules are fixed before work starts and executed
automatically; long projects are split into independently funded
milestones; and once a payment is released on-chain it cannot be
silently reversed.

**Why Blockchain --- and Only Here**

An ordinary database could record milestones, but it cannot remove the
need to trust the company controlling it. A smart contract changes the
**trust model**: once funds are deposited, the release rules are public
and network-enforced, and the platform cannot take or redirect locked
money. We are honest about the limits --- blockchain does **not** verify
real identities, enforce court judgments, or judge whether work is good;
those stay with KYC, terms of service, and human dispute review.
Blockchain is used precisely where it adds value, and nowhere else.

  ------------------------------------------------------------------
  **Can it do this?**   **Bank /    **Centralized      **TrustPay
                         card**       platform**        Escrow**
  ------------------- ------------ ---------------- ----------------
  **Funds held             No            Yes              Yes
  conditionally**                                   

  **Both parties           No             No              Yes
  verify the money**                                

  **Trust in a            Bank         Platform     None for custody
  private custodian**                               
  ------------------------------------------------------------------

*Table 1. The protocol is justified by verifiable, conditional custody
--- not by novelty.*

**Disputes**

Because a contract cannot judge work quality, disputes use a **hybrid
model**: the contract keeps the disputed funds locked while a human or
decentralized arbitrator decides. Either side can open a dispute with a
small fee and evidence; the arbitrator rules to pay, refund, or split
the funds, and the contract executes the verdict. The fee deters
frivolous claims, and outcomes feed a reputation signal.

**Business Model**

- **Transaction fee ---** \~0.5--1.5% per completed escrow, collected
  automatically in stablecoin at release.

- **Business subscription ---** a paid tier with team accounts,
  reporting, and priority support.

- **Dispute resolution fees ---** premium arbitration fees shared with
  arbitrators.

Customers are international freelancers, startups and small businesses
hiring globally, and small agencies. The model is sound because the fee
is a few lines inside a contract that already exists for custody --- no
extra billing infrastructure. Security audits and compliance are treated
as non-negotiable costs.

**Roadmap**

Each phase depends on the proven success of the previous one: **(1)**
proof of concept on a testnet; **(2)** a pilot on a low-cost network
with stablecoins and managed disputes; **(3)** business accounts and
fiat on/off-ramps; **(4)** decentralized arbitration; **(5)**
multi-chain scale. TrustPay Escrow locks money transparently, releases
it on delivery, and lets no private party stand between the two sides
--- buildable today with proven infrastructure. A full technical white
paper is available as a companion document.
