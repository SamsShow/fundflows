import { CONTRACT_CONFIG } from "../config/contracts";
import { Aptos } from "@aptos-labs/ts-sdk";
import { ethers } from "ethers";

class ContractService {
  constructor() {
    // Set up Aptos client for Movement Aptos network
    this.aptosClient = new Aptos({
      nodeUrl: CONTRACT_CONFIG.NETWORK.testnet.aptosNodeUrl,
    });

    // Set up ethers provider for Sepolia (used with MetaMask)
    this.sepoliaProvider = new ethers.JsonRpcProvider(
      CONTRACT_CONFIG.NETWORK.testnet.sepoliaNodeUrl
    );

    // Set up ethers provider for Movement EVM
    this.movementProvider = new ethers.JsonRpcProvider(
      CONTRACT_CONFIG.NETWORK.testnet.movementNodeUrl
    );

    this.contractAddress = CONTRACT_CONFIG.FUNDFLOW_ADDRESS;
  }

  // Get appropriate provider based on wallet type
  getProvider(walletType) {
    if (walletType === "metamask") {
      return this.sepoliaProvider;
    } else if (walletType === "movement_evm") {
      return this.movementProvider;
    }
    return null;
  }

  // This function should be called before any transaction to ensure we have a proper signer
  setBrowserProvider(browserProvider) {
    if (browserProvider) {
      this.browserProvider = new ethers.BrowserProvider(browserProvider);
      return true;
    }
    return false;
  }

  // Get a signer from the browser wallet
  async getSigner() {
    if (!this.browserProvider) {
      throw new Error("Browser provider not set. Please connect wallet first.");
    }
    return await this.browserProvider.getSigner();
  }

  // Create a new project using EVM wallet (MetaMask/Sepolia)
  async createProjectEVM(
    browserProvider,
    title,
    description,
    fundingGoal,
    deadline,
    milestoneDescriptions,
    milestoneAmounts
  ) {
    try {
      // Ensure we have the wallet's provider
      if (!this.setBrowserProvider(browserProvider)) {
        throw new Error("Invalid browser provider");
      }

      // Get signer from the connected wallet
      const signer = await this.getSigner();

      // Create contract instance with ABI
      const contractABI = [
        "function createProject(string title, string description, uint256 fundingGoal, uint256 deadline, string[] milestoneDescriptions, uint256[] milestoneAmounts) external returns (uint256)",
      ];

      const contract = new ethers.Contract(
        this.contractAddress,
        contractABI,
        signer
      );

      // Call the createProject function
      const tx = await contract.createProject(
        title,
        description,
        ethers.parseEther(fundingGoal.toString()),
        deadline,
        milestoneDescriptions,
        milestoneAmounts.map((amount) => ethers.parseEther(amount.toString()))
      );

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Error creating project (EVM):", error);
      throw error;
    }
  }

  // Get project details (Aptos)
  async getProject(projectId) {
    try {
      const response = await this.aptosClient.view({
        payload: {
          function: `${this.contractAddress}::crowdfunding::get_project`,
          typeArguments: [],
          functionArguments: [this.contractAddress, projectId],
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }

  // Create a new project (Aptos)
  async createProject(
    wallet,
    title,
    description,
    fundingGoal,
    deadline,
    milestoneDescriptions,
    milestoneAmounts
  ) {
    try {
      if (!wallet) {
        throw new Error("Wallet instance is required");
      }

      // Get the account from the wallet
      const account = await wallet.account();
      if (!account) {
        throw new Error("No account found in wallet");
      }

      // Convert amounts to proper format (assuming MOVE token has 8 decimals for Aptos)
      const fundingGoalAmount = (
        parseFloat(fundingGoal) * 100000000
      ).toString(); // 8 decimals
      const milestoneAmountsConverted = milestoneAmounts.map(
        (amount) => (parseFloat(amount) * 100000000).toString() // 8 decimals
      );

      const payload = {
        function: `${this.contractAddress}::crowdfunding::create_project`,
        type_arguments: [],
        arguments: [
          title,
          description,
          fundingGoalAmount,
          deadline.toString(),
          milestoneDescriptions,
          milestoneAmountsConverted,
        ],
      };

      // Sign and submit the transaction
      const pendingTransaction = await wallet.signAndSubmitTransaction(payload);

      // Wait for transaction
      const txResult = await this.aptosClient.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });

      return txResult;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  // Fund a project using EVM wallet (MetaMask/Sepolia)
  async fundProjectEVM(browserProvider, projectId, amount) {
    try {
      // Ensure we have the wallet's provider
      if (!this.setBrowserProvider(browserProvider)) {
        throw new Error("Invalid browser provider");
      }

      // Get signer from the connected wallet
      const signer = await this.getSigner();

      // Create contract instance with ABI
      const contractABI = [
        "function fundProject(uint256 projectId) external payable",
      ];

      const contract = new ethers.Contract(
        this.contractAddress,
        contractABI,
        signer
      );

      // Call the fundProject function with the value
      const tx = await contract.fundProject(projectId, {
        value: ethers.parseEther(amount.toString()),
      });

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("Error funding project (EVM):", error);
      throw error;
    }
  }

  // Fund a project (Aptos)
  async fundProject(wallet, projectId, amount) {
    try {
      if (!wallet) {
        throw new Error("Wallet instance is required");
      }

      // Get the account from the wallet
      const account = await wallet.account();
      if (!account) {
        throw new Error("No account found in wallet");
      }

      // Convert amount to proper format (assuming MOVE token has 8 decimals for Aptos)
      const fundingAmount = (parseFloat(amount) * 100000000).toString(); // 8 decimals

      const payload = {
        function: `${this.contractAddress}::crowdfunding::fund_project`,
        type_arguments: [],
        arguments: [projectId, fundingAmount],
      };

      // Sign and submit the transaction
      const pendingTransaction = await wallet.signAndSubmitTransaction(payload);

      // Wait for transaction
      const txResult = await this.aptosClient.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });

      return txResult;
    } catch (error) {
      console.error("Error funding project:", error);
      throw error;
    }
  }

  // Vote on milestone (Aptos)
  async voteOnMilestone(wallet, projectId, milestoneIndex, approve) {
    try {
      if (!wallet) {
        throw new Error("Wallet instance is required");
      }

      // Get the account from the wallet
      const account = await wallet.account();
      if (!account) {
        throw new Error("No account found in wallet");
      }

      const payload = {
        function: `${this.contractAddress}::crowdfunding::vote_on_milestone`,
        type_arguments: [],
        arguments: [projectId, milestoneIndex, approve],
      };

      // Sign and submit the transaction
      const pendingTransaction = await wallet.signAndSubmitTransaction(payload);

      // Wait for transaction
      const txResult = await this.aptosClient.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });

      return txResult;
    } catch (error) {
      console.error("Error voting on milestone:", error);
      throw error;
    }
  }

  // Release funds (Aptos)
  async releaseFunds(wallet, projectId) {
    try {
      if (!wallet) {
        throw new Error("Wallet instance is required");
      }

      // Get the account from the wallet
      const account = await wallet.account();
      if (!account) {
        throw new Error("No account found in wallet");
      }

      const payload = {
        function: `${this.contractAddress}::crowdfunding::release_funds`,
        type_arguments: [],
        arguments: [projectId],
      };

      // Sign and submit the transaction
      const pendingTransaction = await wallet.signAndSubmitTransaction(payload);

      // Wait for transaction
      const txResult = await this.aptosClient.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });

      return txResult;
    } catch (error) {
      console.error("Error releasing funds:", error);
      throw error;
    }
  }

  // Refund backers (Aptos)
  async refundBackers(wallet, projectId) {
    try {
      if (!wallet) {
        throw new Error("Wallet instance is required");
      }

      // Get the account from the wallet
      const account = await wallet.account();
      if (!account) {
        throw new Error("No account found in wallet");
      }

      const payload = {
        function: `${this.contractAddress}::crowdfunding::refund_backers`,
        type_arguments: [],
        arguments: [projectId],
      };

      // Sign and submit the transaction
      const pendingTransaction = await wallet.signAndSubmitTransaction(payload);

      // Wait for transaction
      const txResult = await this.aptosClient.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });

      return txResult;
    } catch (error) {
      console.error("Error refunding backers:", error);
      throw error;
    }
  }
}

export const contractService = new ContractService();
