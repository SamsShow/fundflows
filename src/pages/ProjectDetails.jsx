import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { contractService } from "../services/contractService";
import {
  getProject,
  formatProject,
  fundProject,
  voteOnMilestone,
  releaseFunds,
  refundBackers,
} from "../utils/contractUtils";
import { ethers } from "ethers";

const ProjectDetails = () => {
  const { id } = useParams();
  const { provider, signer, account, isConnected, networkType, activeWallet } =
    useWallet();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState("");
  const [txPending, setTxPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (provider) {
        try {
          const projectData = await getProject(provider, id);
          setProject(formatProject(projectData));
        } catch (error) {
          console.error("Error fetching project:", error);
          setError("Failed to load project details. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProject();
  }, [provider, id]);

  // Mock data for when we don't have a provider
  useEffect(() => {
    if (!provider) {
      const mockProject = {
        id: id,
        owner: "0x1234567890123456789012345678901234567890",
        title: "Eco-Friendly Water Purifier",
        description:
          "A sustainable water purification system that uses solar power and natural filtration to provide clean drinking water to communities in need. This innovative solution combines advanced filtration technology with renewable energy sources to create an environmentally friendly and cost-effective water purification system.",
        fundingGoal: "10.0",
        currentAmount: "7.5",
        status: "Funding",
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        milestones: [
          {
            description: "Complete prototype design and testing",
            amount: "3.0",
            status: "Approved",
            votesFor: "7.5",
            votesAgainst: "0.0",
          },
          {
            description: "Manufacture initial batch of 100 units",
            amount: "4.0",
            status: "Pending",
            votesFor: "3.2",
            votesAgainst: "1.5",
          },
          {
            description: "Deploy units to 5 test communities",
            amount: "3.0",
            status: "Pending",
            votesFor: "0.0",
            votesAgainst: "0.0",
          },
        ],
        currentMilestone: "1",
      };

      setProject(mockProject);
      setLoading(false);
    }
  }, [provider, id]);

  const handleFund = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      setError("Please connect your wallet first.");
      return;
    }

    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setTxPending(true);
    setError(null);
    setSuccess(null);

    try {
      let tx;

      // Use different method based on network type
      if (networkType === "evm") {
        // For EVM networks (MetaMask/Sepolia)
        if (activeWallet === "metamask" && window.ethereum) {
          tx = await contractService.fundProjectEVM(
            window.ethereum,
            id,
            fundAmount
          );
        } else {
          throw new Error("EVM wallet not properly connected");
        }
      } else if (networkType === "aptos") {
        // For Aptos networks (OKX, etc)
        if (!window.okxwallet || !window.okxwallet.aptos) {
          throw new Error("OKX wallet not found");
        }

        // Get the OKX wallet instance
        const wallet = window.okxwallet.aptos;

        // Ensure we have an account
        const account = await wallet.account();
        if (!account) {
          throw new Error("No account found in OKX wallet");
        }

        tx = await contractService.fundProject(wallet, id, fundAmount);
      } else {
        throw new Error("Unsupported network type");
      }

      setSuccess(
        "Project funded successfully! Transaction hash: " +
          (tx.hash || tx.transactionHash)
      );
      setFundAmount("");

      // Refresh project data
      const projectData = await contractService.getProject(id);
      setProject(projectData);
    } catch (error) {
      console.error("Error funding project:", error);
      setError(`Failed to fund project: ${error.message || "Unknown error"}`);
    } finally {
      setTxPending(false);
    }
  };

  const handleVote = async (milestoneIndex, approve) => {
    if (!isConnected) {
      setError("Please connect your wallet first.");
      return;
    }

    setTxPending(true);
    setError(null);
    setSuccess(null);

    try {
      const tx = await voteOnMilestone(signer, id, milestoneIndex, approve);

      setSuccess(
        `Vote ${
          approve ? "approved" : "rejected"
        } successfully! Transaction hash: ${tx.hash}`
      );

      // Refresh project data
      const projectData = await getProject(provider, id);
      setProject(formatProject(projectData));
    } catch (error) {
      console.error("Error voting on milestone:", error);
      setError("Failed to vote. Please try again.");
    } finally {
      setTxPending(false);
    }
  };

  const handleReleaseFunds = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first.");
      return;
    }

    setTxPending(true);
    setError(null);
    setSuccess(null);

    try {
      const tx = await releaseFunds(signer, id);

      setSuccess("Funds released successfully! Transaction hash: " + tx.hash);

      // Refresh project data
      const projectData = await getProject(provider, id);
      setProject(formatProject(projectData));
    } catch (error) {
      console.error("Error releasing funds:", error);
      setError("Failed to release funds. Please try again.");
    } finally {
      setTxPending(false);
    }
  };

  const handleRefund = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first.");
      return;
    }

    setTxPending(true);
    setError(null);
    setSuccess(null);

    try {
      const tx = await refundBackers(signer, id);

      setSuccess("Refund initiated successfully! Transaction hash: " + tx.hash);

      // Refresh project data
      const projectData = await getProject(provider, id);
      setProject(formatProject(projectData));
    } catch (error) {
      console.error("Error refunding backers:", error);
      setError("Failed to initiate refund. Please try again.");
    } finally {
      setTxPending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/projects"
            className="bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Browse Projects
          </Link>
        </div>
      </div>
    );
  }

  const isOwner =
    account && account.toLowerCase() === project.owner.toLowerCase();
  const isFundingActive = project.status === "Funding";
  const isFunded =
    project.status === "Funded" || project.status === "Completed";
  const isCompleted = project.status === "Completed";
  const currentMilestone =
    project.milestones[parseInt(project.currentMilestone)];
  const progressPercentage = Math.min(
    100,
    Math.round(
      (parseFloat(project.currentAmount) / parseFloat(project.fundingGoal)) *
        100
    )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project Header */}
      <div className="bg-zinc-700 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-64 bg-gray-200"></div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                project.status === "Funding"
                  ? "bg-primary/10 text-primary"
                  : project.status === "Funded"
                  ? "bg-secondary/10 text-secondary"
                  : project.status === "Completed"
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              {project.status}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{project.description}</p>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Funding Goal</p>
              <p className="text-xl font-semibold text-black">
                {project.fundingGoal} MOVE
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Raised</p>
              <p className="text-xl font-semibold text-black">
                {project.currentAmount} MOVE
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="text-xl font-semibold text-black">
                {project.deadline instanceof Date
                  ? project.deadline.toLocaleDateString()
                  : project.deadline}
              </p>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Created by</p>
              <p className="font-medium">
                {project.owner.slice(0, 6)}...{project.owner.slice(-4)}
              </p>
            </div>
          </div>

          {/* Fund Project Form */}
          {isFundingActive && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4 text-black">
                Support This Project
              </h3>

              {error && (
                <div className="bg-error/10 text-error p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-success/10 text-success p-3 rounded-lg mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleFund}>
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-gray-700 mb-2">
                    Amount (MOVE)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter amount"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    disabled={txPending || !isConnected}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors ${
                    txPending || !isConnected
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={txPending || !isConnected}
                >
                  {txPending ? "Processing..." : "Fund Project"}
                </button>

                {!isConnected && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Please connect your wallet to fund this project.
                  </p>
                )}
              </form>
            </div>
          )}

          {/* Project Actions */}
          <div className="flex flex-wrap gap-4">
            {isOwner &&
              isFunded &&
              currentMilestone &&
              currentMilestone.status === "Approved" && (
                <button
                  onClick={handleReleaseFunds}
                  className={`bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors ${
                    txPending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={txPending}
                >
                  {txPending ? "Processing..." : "Release Milestone Funds"}
                </button>
              )}

            {isOwner && isFundingActive && (
              <button
                onClick={handleRefund}
                className={`bg-error text-white px-6 py-2 rounded-lg hover:bg-error/90 transition-colors ${
                  txPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={txPending}
              >
                {txPending ? "Processing..." : "Cancel Project & Refund"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="bg-zinc-700 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Project Milestones</h2>

          <div className="space-y-6">
            {project.milestones.map((milestone, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  parseInt(project.currentMilestone) === index
                    ? "border-primary"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">
                    Milestone {index + 1}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      milestone.status === "Pending"
                        ? "bg-gray-200 text-gray-700"
                        : milestone.status === "Approved"
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    {milestone.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-3">{milestone.description}</p>

                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Funding: {milestone.amount} MOVE</span>
                  <span>
                    Votes: {milestone.votesFor} for / {milestone.votesAgainst}{" "}
                    against
                  </span>
                </div>

                {isFunded &&
                  parseInt(project.currentMilestone) === index &&
                  milestone.status === "Pending" &&
                  isConnected && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(index, true)}
                        className={`bg-success text-white px-4 py-1 rounded-lg hover:bg-success/90 transition-colors ${
                          txPending ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={txPending}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVote(index, false)}
                        className={`bg-error text-white px-4 py-1 rounded-lg hover:bg-error/90 transition-colors ${
                          txPending ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={txPending}
                      >
                        Reject
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
