# 🚀 BotDAO — Whitepaper & Pitch Deck (v1.0)
> **Decentralized Community Governance & Treasury Infrastructure on Botchain**
>
> **Network:** Botchain Mainnet (Chain ID 677)  
> **Contract Address:** `0x8e0FC0fAe92E70D83fC6Bdf0a124057394A0dA57`  
> **Block Explorer:** [https://scan.botchain.ai/address/0x8e0FC0fAe92E70D83fC6Bdf0a124057394A0dA57](https://scan.botchain.ai/address/0x8e0FC0fAe92E70D83fC6Bdf0a124057394A0dA57)  
> **Status:** Production-Ready MVP deployed on Mainnet

---

## 1. Executive Summary

Emerging blockchain ecosystems face a critical hurdle: early-stage community funds, developer grants, and ecosystem treasuries remain controlled by opaque multisigs or centralized foundations. This undermines community trust and stalls grassroots innovation.

**BotDAO** provides the foundational governance and treasury primitive for the Botchain ecosystem. It introduces a trustless, transparent on-chain treasury where community members deposit native `BOT` tokens, submit granular funding proposals, vote transparently, and automatically trigger non-custodial payouts upon reaching quorum and approval.

### Core Value Propositions:
- **100% Non-Custodial:** No admin keys, deployer privileges, or backdoors. Funds release strictly via passed community proposals.
- **Democratic 1-Wallet = 1-Vote:** Immutable on-chain voting records with double-vote prevention.
- **Trustless Public Execution:** Any community member can trigger execution of passed proposals, transferring funds directly to recipients.

---

## 2. Problem Statement & Market Need

| Traditional Model / The Problem | The BotDAO Solution |
| :--- | :--- |
| **Centralized Custody:** Foundation multisigs hold grant funds, introducing single points of failure and censorship. | **Autonomous Smart Contract Vault:** Funds are locked in a verified smart contract on Botchain. |
| **Complex DAO Tooling:** Existing platforms (Aragon, Tally) are expensive, complex, or unavailable on emerging EVMs. | **Turnkey Web3 DApp:** Lightweight, low-gas, tailored specifically for Botchain RPC and Explorer. |
| **Opaque Allocations:** Token holders cannot verify real-time treasury balances or voting results. | **100% On-Chain Visibility:** Batch queries (`getAllProposals`), instant live tallies, and explorer verification. |

---

## 3. Protocol Architecture & Governance Lifecycle

```
[1. Deposit Native BOT] 
         │
         ▼
[2. Submit Proposal] ──► (Recipient, Amount, Description, Voting Duration)
         │
         ▼
[3. On-Chain Voting] ──► (1-Wallet-1-Vote: FOR or AGAINST)
         │
         ▼
[4. Verification]   ──► (Voting Ended? Quorum Reached? Majority FOR?)
         │
         ├── Passed ──► [5. Public Execution] ──► BOT Disbursed to Recipient
         │
         └── Failed ──► Rejected / Funds Kept in Treasury Vault
```

### Mathematical Passing Criteria
A proposal $p$ passes if and only if:
1. `block.timestamp >= p.endTime` (Voting concludes)
2. $(p.forVotes + p.againstVotes) \ge quorumVotes$ (Quorum requirement met)
3. $p.forVotes > p.againstVotes$ (Strict majority in favor)

---

## 4. Smart Contract Specification (`contracts/BotDAO.sol`)

- **Language & Standards:** Solidity `^0.8.24`, OpenZeppelin `ReentrancyGuard`.
- **Primary Methods:**
  - `depositTreasury()`: External payable deposit for native BOT tokens.
  - `createProposal(recipient, amount, description, duration)`: Generates on-chain proposal ID and initiates countdown.
  - `vote(proposalId, support)`: Records vote and toggles `hasVoted[proposalId][voter] = true`.
  - `proposalPassed(proposalId)`: View method checking quorum and majority.
  - `executeProposal(proposalId)`: Reentrancy-guarded transfer of BOT to recipient.
  - `cancelProposal(proposalId)`: Proposer-controlled cancellation before execution.
  - `getAllProposals()`: Single RPC batch retrieval for frontend rendering.

---

## 5. Full-Stack Web3 Application

- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- **Client Libraries:** Wagmi v2 + Viem v2 + TanStack React Query.
- **Pages & Modules:**
  - `/` — Homepage & Ecosystem Overview
  - `/dashboard` — Treasury & Governance Health
  - `/proposals` — Proposal Explorer (Filter by Active, Passed, Defeated, Executed, Canceled)
  - `/proposals/[id]` — Proposal Detail, Live Countdown, and Interactive Voting Panel
  - `/create-proposal` — Proposal submission wizard with parameter validation
  - `/treasury` — Vault balances and quick deposit interface

---

## 6. Strategic Roadmap

- **Phase 1 (Completed ✅):**
  - Smart contract development & Hardhat unit test suite.
  - Deployment on Botchain Mainnet (`0x8e0FC0fAe92E70D83fC6Bdf0a124057394A0dA57`).
  - Next.js 14 web dApp with live Wagmi v2 integration.
- **Phase 2:**
  - Token-weighted voting standard (ERC-20 governance).
  - Snapshot voting power & delegation mechanics.
- **Phase 3:**
  - BotNS (Botchain Name Service) `.bot` domain name resolution.
  - Member governance badges and on-chain contribution scoring.
- **Phase 4:**
  - Multi-DAO factory contracts for instant deployment of sub-DAOs.
  - Treasury yield strategies on Botchain DeFi protocols.

---

## 7. Verified Network & Contact Details

- **DAO Name:** BotDAO
- **Network Name:** Botchain Mainnet
- **Chain ID:** `677`
- **RPC URL:** `https://rpc.botchain.ai`
- **Contract Address:** `0x8e0FC0fAe92E70D83fC6Bdf0a124057394A0dA57`
- **Block Explorer:** `https://scan.botchain.ai/address/0x8e0FC0fAe92E70D83fC6Bdf0a124057394A0dA57`
- **License:** MIT Open Source
