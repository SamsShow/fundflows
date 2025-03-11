# FundFlow - A Decentralized Crowdfunding Platform

## Project Overview

FundFlow is a decentralized crowdfunding platform built on the Movement Labs blockchain, designed to eliminate intermediaries and bring transparency to project funding. By leveraging smart contracts written in Move, FundFlow ensures secure, milestone-based fund releases and refunds in case of unmet goals.

## Key Features

- **Trustless Crowdfunding**: Backers fund projects directly via smart contracts.
- **Milestone-Based Fund Releases**: Funds are disbursed in stages based on project progress.
- **Automated Refunds**: If funding goals are not met, backers get their funds back automatically.
- **Transparent & Secure**: Every transaction is on-chain, ensuring transparency.
- **Crypto Payments**: Accepts stablecoins or native Movement Labs tokens for contributions.

## Technology Stack

- **Blockchain**: Movement Labs
- **Smart Contract Language**: Move
- **Frontend**: React + Vite
- **Wallet Integration**:
  - Movement Wallet
  - Martian, Fewcha, or Petra Wallet
  - MetaMask (for Ethereum compatibility)
  - OKX Wallet (for Aptos compatibility) - configure your wallet with the following details
  ![image](/public/Screenshot.png)

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Compatible wallet extensions installed in your browser

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd fundflow
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Install specific blockchain dependencies:

   ```bash
   npm install ethers@5.7.2 @aptos-labs/ts-sdk
   # or
   yarn add ethers@5.7.2 @aptos-labs/ts-sdk
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## How It Works

### Project Creation

Creators define their funding goals, milestones, and deadlines through an intuitive interface.

### Funding Phase

Backers contribute funds to the smart contract, which holds them in escrow until conditions are met.

### Milestone Verification

Funds are released as milestones are achieved and verified by the community or designated verifiers.

### Refund Mechanism

If goals are not met within the specified timeframe, funds are automatically refunded to backers.

### Project Completion

Successfully funded projects receive full payouts once all milestones are completed.

## Wallet Configuration

### Movement Wallet

- Network: Movement Labs Testnet
- Configuration details will be provided upon Movement Labs mainnet launch

### MetaMask (Ethereum Compatibility)

- Network: Sepolia Testnet
- RPC URL: https://sepolia.infura.io/v3/[your-infura-key]
- Chain ID: 11155111
- Currency Symbol: ETH

### OKX Wallet (Aptos Compatibility)

- Network: Aptos Testnet
- RPC URL: https://fullnode.testnet.aptoslabs.com/v1
- Chain ID: 2

- Network: Movement Labs Bardock Testnet
- RPC URL: https://aptos.testnet.bardock.movementlabs.xyz/v1
- Chain ID: 250
- Currency Symbol: MOVE


## Smart Contract Functionality

- **create_project()** → Registers a new project with funding details.
- **fund_project()** → Allows users to contribute funds.
- **release_funds()** → Releases funds to the creator when milestones are met.
- **refund_backers()** → Returns funds if the project fails to meet goals.
- **vote_on_milestones()** → Enables backers to approve milestone completion.

## Deployment Information

### Contract Deployment

- **Wallet Address**:0xd5ff7fd86cd844e54533482fbca61e5b2a7159242d5fff1cc16337c75fac4b59
- **Contract Address**:0xd5ff7fd86cd844e54533482fbca61e5b2a7159242d5fff1cc16337c75fac4b59
- **Transaction Hash**:0xf7a373289b1c4d41cdfa6b1c95f9de61d9c02755dc2bc2d7e02dae3b5911cd23
- **Network**: Movement Labs Bardock Testnet

## Security & Gas Optimization

- Implementing reentrancy protection and access control
- Optimizing storage and transaction costs in Move smart contracts
- Using off-chain computation where possible to reduce gas fees
- Leveraging Movement Labs' scalability features for faster transactions

