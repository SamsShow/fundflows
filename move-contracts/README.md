# FundFlow Smart Contracts

This directory contains the Move smart contracts for the FundFlow decentralized crowdfunding platform.

## Overview

FundFlow is a decentralized crowdfunding platform built on the Movement Labs blockchain. The smart contracts in this directory implement the core functionality of the platform, including:

- Project creation with milestone-based funding
- Contribution tracking
- Milestone voting and approval
- Fund release based on milestone completion
- Automatic refunds if funding goals are not met

## Contract Structure

The main contract is `fundflow.move`, which contains the following key components:

### Data Structures

- `Project`: Represents a crowdfunding project with details like title, description, funding goal, and milestones.
- `Milestone`: Represents a project milestone with description, amount, and voting status.
- `Contribution`: Tracks a user's contribution to a project.
- `FundFlowState`: The global state of the platform, storing all projects and contributions.

### Key Functions

- `initialize`: Sets up the FundFlow platform.
- `create_project`: Creates a new crowdfunding project with milestones.
- `fund_project`: Allows users to contribute funds to a project.
- `vote_on_milestone`: Enables backers to vote on milestone completion.
- `release_funds`: Releases funds to the project creator when milestones are approved.
- `refund_backers`: Returns funds to backers if the project fails to meet its goals.

## Development

### Prerequisites

- Movement Labs SDK
- Move compiler

### Building

To build the contracts:

```bash
move build
```

### Testing

To run the tests:

```bash
move test
```

### Deployment

To deploy the contracts to the Movement Labs testnet:

```bash
move publish
```

## Security Considerations

The current implementation includes TODOs for token transfers, which would be implemented using Movement Labs' token standards in a production environment. In a real deployment, additional security measures would be implemented, including:

- Reentrancy protection
- Access control
- Formal verification
- Security audits

## License

[MIT License](LICENSE)
