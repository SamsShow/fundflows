import { ethers } from "ethers";

// This would be replaced with the actual ABI from the compiled Move contract
// For now, we'll use a placeholder ABI
const contractABI = [
  // Example ABI for our FundFlow contract
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "fundingGoal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "milestoneDescriptions",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "milestoneAmounts",
        type: "uint256[]",
      },
    ],
    name: "createProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    name: "fundProject",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "milestoneIndex",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "approve",
        type: "bool",
      },
    ],
    name: "voteOnMilestone",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    name: "releaseFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    name: "refundBackers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    name: "getProject",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "fundingGoal",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentAmount",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "status",
            type: "uint8",
          },
          {
            components: [
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "status",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "votesFor",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "votesAgainst",
                type: "uint256",
              },
            ],
            internalType: "struct FundFlow.Milestone[]",
            name: "milestones",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "currentMilestone",
            type: "uint256",
          },
        ],
        internalType: "struct FundFlow.Project",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProjectCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Contract address would be replaced with the actual deployed contract address
const contractAddress = "0x1234567890123456789012345678901234567890";

// Get contract instance
export const getContract = (provider) => {
  return new ethers.Contract(contractAddress, contractABI, provider);
};

// Initialize the platform
export const initializePlatform = async (signer) => {
  const contract = getContract(signer);
  const tx = await contract.initialize();
  return tx.wait();
};

// Create a new project
export const createProject = async (
  signer,
  title,
  description,
  fundingGoal,
  deadline,
  milestoneDescriptions,
  milestoneAmounts
) => {
  const contract = getContract(signer);
  const tx = await contract.createProject(
    title,
    description,
    fundingGoal,
    deadline,
    milestoneDescriptions,
    milestoneAmounts
  );
  return tx.wait();
};

// Fund a project
export const fundProject = async (signer, projectId, amount) => {
  const contract = getContract(signer);
  const tx = await contract.fundProject(projectId, { value: amount });
  return tx.wait();
};

// Vote on a milestone
export const voteOnMilestone = async (
  signer,
  projectId,
  milestoneIndex,
  approve
) => {
  const contract = getContract(signer);
  const tx = await contract.voteOnMilestone(projectId, milestoneIndex, approve);
  return tx.wait();
};

// Release funds for a milestone
export const releaseFunds = async (signer, projectId) => {
  const contract = getContract(signer);
  const tx = await contract.releaseFunds(projectId);
  return tx.wait();
};

// Refund backers
export const refundBackers = async (signer, projectId) => {
  const contract = getContract(signer);
  const tx = await contract.refundBackers(projectId);
  return tx.wait();
};

// Get project details
export const getProject = async (provider, projectId) => {
  const contract = getContract(provider);
  return await contract.getProject(projectId);
};

// Get project count
export const getProjectCount = async (provider) => {
  const contract = getContract(provider);
  return await contract.getProjectCount();
};

// Get all projects
export const getAllProjects = async (provider) => {
  const contract = getContract(provider);
  const count = await contract.getProjectCount();

  const projects = [];
  for (let i = 0; i < count; i++) {
    const project = await contract.getProject(i);
    projects.push(project);
  }

  return projects;
};

// Helper function to format project data
export const formatProject = (project) => {
  return {
    id: project.id.toString(),
    owner: project.owner,
    title: project.title,
    description: project.description,
    fundingGoal: ethers.formatEther(project.fundingGoal),
    deadline: new Date(project.deadline * 1000),
    currentAmount: ethers.formatEther(project.currentAmount),
    status: getProjectStatus(project.status),
    milestones: project.milestones.map((milestone) => ({
      description: milestone.description,
      amount: ethers.formatEther(milestone.amount),
      status: getMilestoneStatus(milestone.status),
      votesFor: ethers.formatEther(milestone.votesFor),
      votesAgainst: ethers.formatEther(milestone.votesAgainst),
    })),
    currentMilestone: project.currentMilestone.toString(),
  };
};

// Helper function to get project status string
export const getProjectStatus = (status) => {
  switch (Number(status)) {
    case 0:
      return "Funding";
    case 1:
      return "Funded";
    case 2:
      return "Failed";
    case 3:
      return "Completed";
    default:
      return "Unknown";
  }
};

// Helper function to get milestone status string
export const getMilestoneStatus = (status) => {
  switch (Number(status)) {
    case 0:
      return "Pending";
    case 1:
      return "Approved";
    case 2:
      return "Rejected";
    default:
      return "Unknown";
  }
};
