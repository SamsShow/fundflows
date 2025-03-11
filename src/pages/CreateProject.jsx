import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";

const CreateProject = () => {
  const navigate = useNavigate();
  const {
    signer,
    isConnected,
    activeWallet,
    networkType,
    provider,
    contractService,
  } = useWallet();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [milestones, setMilestones] = useState([
    { description: "", amount: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMilestone = () => {
    setMilestones([...milestones, { description: "", amount: "" }]);
  };

  const removeMilestone = (index) => {
    if (milestones.length > 1) {
      const updatedMilestones = [...milestones];
      updatedMilestones.splice(index, 1);
      setMilestones(updatedMilestones);
    }
  };

  const updateMilestone = (index, field, value) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index][field] = value;
    setMilestones(updatedMilestones);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      setError("Please connect your wallet first.");
      return;
    }

    if (!signer && networkType === "aptos") {
      setError(
        "Aptos wallet not properly connected. Please reconnect your wallet."
      );
      return;
    }

    // Validate form
    if (!title.trim()) {
      setError("Please enter a project title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a project description.");
      return;
    }

    if (!fundingGoal || parseFloat(fundingGoal) <= 0) {
      setError("Please enter a valid funding goal.");
      return;
    }

    if (!deadline) {
      setError("Please select a deadline.");
      return;
    }

    // Validate milestones
    let totalMilestoneAmount = 0;
    for (const milestone of milestones) {
      if (!milestone.description.trim()) {
        setError("Please enter a description for all milestones.");
        return;
      }

      if (!milestone.amount || parseFloat(milestone.amount) <= 0) {
        setError("Please enter a valid amount for all milestones.");
        return;
      }

      totalMilestoneAmount += parseFloat(milestone.amount);
    }

    // Check if milestone amounts sum up to funding goal
    if (Math.abs(totalMilestoneAmount - parseFloat(fundingGoal)) > 0.001) {
      setError("The sum of milestone amounts must equal the funding goal.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert deadline to Unix timestamp
      const deadlineDate = new Date(deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);

      // Prepare milestone data
      const milestoneDescriptions = milestones.map((m) => m.description);
      const milestoneAmounts = milestones.map((m) => m.amount);

      let tx;

      // Use different method based on network type
      if (networkType === "evm") {
        // For EVM networks (MetaMask/Sepolia)
        if (activeWallet === "metamask" && window.ethereum) {
          tx = await contractService.createProjectEVM(
            window.ethereum,
            title,
            description,
            fundingGoal,
            deadlineTimestamp,
            milestoneDescriptions,
            milestoneAmounts
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

        tx = await contractService.createProject(
          wallet, // Pass the wallet instance instead of signer
          title,
          description,
          fundingGoal,
          deadlineTimestamp,
          milestoneDescriptions,
          milestoneAmounts
        );
      } else {
        throw new Error("Unsupported network type");
      }

      console.log("Project created successfully:", tx);
      // Navigate to projects page after successful creation
      navigate("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      setError(`Failed to create project: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date for deadline (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Project</h1>

      {!isConnected ? (
        <div className="bg-primary/10 p-6 rounded-lg text-center mb-8">
          <p className="text-lg mb-4">
            Please connect your wallet to create a project.
          </p>
          <button
            className="bg-primary text-neutral-50 px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => window.scrollTo(0, 0)}
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="bg-neutral-50 dark:bg-neutral-500 rounded-lg shadow-md p-6 border border-neutral-100 dark:border-neutral-400">
          {error && (
            <div className="bg-error/10 text-error p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Project Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>

              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-neutral-600 dark:text-neutral-200 mb-2"
                >
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-500 border border-neutral-200 dark:border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-neutral-600 dark:text-neutral-200 mb-2"
                >
                  Project Description *
                </label>
                <textarea
                  id="description"
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-500 border border-neutral-200 dark:border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 h-32"
                  placeholder="Describe your project in detail"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fundingGoal"
                    className="block text-neutral-600 dark:text-neutral-200 mb-2"
                  >
                    Funding Goal (MOVE) *
                  </label>
                  <input
                    type="number"
                    id="fundingGoal"
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-500 border border-neutral-200 dark:border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter funding goal"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-neutral-600 dark:text-neutral-200 mb-2"
                  >
                    Funding Deadline *
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-500 border border-neutral-200 dark:border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={minDate}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Project Milestones</h2>
                <button
                  type="button"
                  className="bg-secondary text-neutral-50 px-4 py-1 rounded-lg hover:bg-secondary/90 transition-colors text-sm"
                  onClick={addMilestone}
                >
                  Add Milestone
                </button>
              </div>

              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="bg-neutral-50 dark:bg-neutral-500 border border-neutral-200 dark:border-neutral-400 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Milestone {index + 1}</h3>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          className="text-error hover:text-error/80 transition-colors"
                          onClick={() => removeMilestone(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="block text-neutral-600 dark:text-neutral-200 mb-1 text-sm">
                        Description *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-500 border border-neutral-200 dark:border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Describe this milestone"
                        value={milestone.description}
                        onChange={(e) =>
                          updateMilestone(index, "description", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 dark:text-neutral-200 mb-1 text-sm">
                        Amount (MOVE) *
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-500 border border-neutral-200 dark:border-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Funding amount for this milestone"
                        value={milestone.amount}
                        onChange={(e) =>
                          updateMilestone(index, "amount", e.target.value)
                        }
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-300">
                <p>
                  Note: The sum of all milestone amounts should equal your total
                  funding goal.
                </p>
                <p className="mt-1">
                  Current total:{" "}
                  {milestones
                    .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0)
                    .toFixed(2)}{" "}
                  MOVE
                  {fundingGoal && ` / ${fundingGoal} MOVE`}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`bg-primary text-neutral-50 px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Creating Project..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
