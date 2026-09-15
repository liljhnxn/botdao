# 🚀 BOTDAO — Decentralized Community Governance & Treasury

> **Govern Together. Build On-Chain.**
>
> A decentralized community treasury where users create proposals, vote on decisions, and execute approved payments entirely on-chain on Botchain Testnet.

---

## 🌟 Overview

**BotDAO** is a full-stack Web3 application and decentralized autonomous organization (DAO) on **Botchain/Bohr Testnet (Chain ID 968)**. It empowers community members to pool native BOT tokens into a shared treasury, submit detailed funding proposals, cast on-chain votes, and trigger non-custodial payouts to verified recipients once proposals pass.

---

## ✨ Features

- **🏦 Native BOT Treasury**: Direct deposits into the non-custodial smart contract with real-time balance tracking.
- **📝 On-Chain Proposal Creation**: Submit funding requests specifying recipient address, amount, description, and custom voting duration.
- **🗳️ 1-Wallet = 1-Vote Governance**: Transparent voting mechanics preventing double-voting and recording results on-chain.
- **⚖️ Quorum & Majority Verification**: Automatic smart contract verification requiring quorum votes and majority FOR votes before passing.
- **⚡ Trustless Execution**: Anyone can execute passed proposals to transfer funds directly from the treasury to the recipient.
- **🚫 Proposer Cancellation**: Proposers retain the ability to cancel proposals before voting concludes or execution occurs.
- **🔮 BotNS Integration Ready**: Architecture prepared for resolving `.bot` domain names.
- **🎨 Futuristic Web3 UI**: Dark glassmorphic interface built with Next.js 14, Tailwind CSS, Lucide icons, and Wagmi/Viem.

---

## 🛠️ Tech Stack

- **Smart Contract**: Solidity `^0.8.24`, OpenZeppelin Contracts (`ReentrancyGuard`)
- **Blockchain Framework**: Hardhat 2 / 3, Ethers v6, TypeChain
- **Target Network**: Botchain / Bohr Testnet (Chain ID `968`)
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Web3 Client**: `wagmi` v2, `viem` v2, `@tanstack/react-query`
- **Icons & UI**: `lucide-react`, `clsx`, `tailwind-merge`

---

## 🌐 Botchain Testnet Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Block Explorer** | `https://scan.bohr.life` |
| **Native Currency** | `BOT` (18 Decimals) |

---

## 🏛️ Smart Contract Architecture (`contracts/BotDAO.sol`)

### Core State & Structs

```solidity
struct Proposal {
    uint256 id;
    address proposer;
    address recipient;
    uint256 amount;
    string description;
    uint256 startTime;
    uint256 endTime;
    uint256 forVotes;
    uint256 againstVotes;
    bool executed;
    bool canceled;
}
```

### Key Functions

1. `depositTreasury() external payable`: Deposits native BOT into the DAO treasury.
2. `createProposal(address recipient, uint256 amount, string description, uint256 votingDuration) external returns (uint256)`: Creates a new proposal.
3. `vote(uint256 proposalId, bool support) external`: Casts a vote (FOR or AGAINST) on an active proposal.
4. `proposalPassed(uint256 proposalId) public view returns (bool)`: Verifies if voting ended, quorum reached, and FOR > AGAINST.
5. `executeProposal(uint256 proposalId) external nonReentrant`: Disburses treasury BOT to the recipient for passed proposals.
6. `cancelProposal(uint256 proposalId) external`: Allows the proposer to cancel their proposal.
7. `getAllProposals() external view returns (Proposal[] memory)`: Returns all proposals in a single RPC call for high frontend performance.

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the variables:

```env
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=968
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=https://scan.bohr.life
NEXT_PUBLIC_BOTDAO_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_private_key_here
```

### 3. Run Tests

Run the comprehensive Hardhat test suite:

```bash
npm test
```

### 4. Deploy Smart Contract to Botchain Testnet

Ensure you have testnet BOT in your deployer account, then run:

```bash
npm run deploy
```

Copy the printed contract address into `NEXT_PUBLIC_BOTDAO_CONTRACT_ADDRESS` in `.env.local`.

### 5. Start Frontend Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security Notes & Governance Model

> [!NOTE]
> **Learning & MVP Governance Notice:**
> The current version implements a **One wallet = one vote** model for simplicity and hackathon demonstration. It is not Sybil-resistant in a permissionless production environment without identity verification (e.g. Gitcoin Passport, Proof of Humanity) or token-weighted voting.

- **Non-Custodial**: There are no admin keys or backdoors capable of withdrawing DAO treasury funds.
- **Reentrancy Protection**: Uses OpenZeppelin's `ReentrancyGuard` and strict Checks-Effects-Interactions patterns.
- **Public Execution**: Any community member can trigger execution of passed proposals.

---

## 🗺️ Future Roadmap

- **Phase 1 (Complete)**:
  - [x] Native BOT treasury vault
  - [x] Proposal creation with custom voting durations
  - [x] On-chain voting and double-voting prevention
  - [x] Quorum and majority enforcement
  - [x] Safe non-custodial execution

- **Phase 2**:
  - [ ] Token-weighted voting (governance ERC-20 / Botchain standard)
  - [ ] Delegated voting and voting power snapshots
  - [ ] Dynamic quorum based on treasury utilization

- **Phase 3**:
  - [ ] BotNS identity resolution (`alex.bot`)
  - [ ] DAO member profiles and reputation scores
  - [ ] Multi-DAO factory contracts

- **Phase 4**:
  - [ ] Advanced treasury analytics and historical charts
  - [ ] Cross-dApp ecosystem integrations on Botchain

---

## 📜 License

MIT
