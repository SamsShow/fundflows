import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { getAllProjects, formatProject } from "../utils/contractUtils";

const Dashboard = () => {
  const { provider, account, isConnected } = useWallet();
  const [myProjects, setMyProjects] = useState([]);
  const [myContributions, setMyContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    const fetchProjects = async () => {
      if (provider && isConnected) {
        try {
          const allProjects = await getAllProjects(provider);
          const formattedProjects = allProjects.map(formatProject);

          // Filter projects created by the user
          const userProjects = formattedProjects.filter(
            (project) => project.owner.toLowerCase() === account.toLowerCase()
          );
          setMyProjects(userProjects);

          // Filter projects the user has contributed to
          // In a real implementation, we would have a way to track user contributions
          // For now, we'll use mock data
          const userContributions = formattedProjects
            .filter(
              (project) => project.owner.toLowerCase() !== account.toLowerCase()
            )
            .slice(0, 3); // Just take the first 3 for demo purposes

          setMyContributions(userContributions);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [provider, account, isConnected]);

  // Mock data for when we don't have a provider or for testing
  useEffect(() => {
    if (!provider || !isConnected) {
      setMyProjects([
        {
          id: "1",
          title: "Eco-Friendly Water Purifier",
          description:
            "A sustainable water purification system that uses solar power and natural filtration.",
          fundingGoal: "10.0",
          currentAmount: "7.5",
          status: "Funding",
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        },
        {
          id: "2",
          title: "Community Garden Initiative",
          description:
            "Creating urban gardens to provide fresh produce to underserved communities.",
          fundingGoal: "5.0",
          currentAmount: "4.2",
          status: "Funding",
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
      ]);

      setMyContributions([
        {
          id: "3",
          title: "Decentralized Education Platform",
          description:
            "A blockchain-based platform for accessible and verifiable educational credentials.",
          fundingGoal: "15.0",
          currentAmount: "12.8",
          status: "Funding",
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          contribution: "2.5",
        },
        {
          id: "4",
          title: "Renewable Energy Microgrid",
          description:
            "A community-owned renewable energy microgrid for sustainable power generation.",
          fundingGoal: "20.0",
          currentAmount: "5.2",
          status: "Funding",
          deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          contribution: "1.0",
        },
      ]);

      setLoading(false);
    }
  }, [provider, isConnected]);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-primary/10 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-lg mb-6">
            Please connect your wallet to view your dashboard.
          </p>
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => window.scrollTo(0, 0)} // Scroll to top to show connect button in navbar
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Connected as</p>
            <p className="font-medium text-black">{account}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "projects"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          My Projects
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "contributions"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("contributions")}
        >
          My Contributions
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === "projects" ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Projects</h2>
            <Link
              to="/create-project"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create New Project
            </Link>
          </div>

          {myProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-zinc-200 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-black">{project.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
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

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>
                          {Math.round(
                            (parseFloat(project.currentAmount) /
                              parseFloat(project.fundingGoal)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                (parseFloat(project.currentAmount) /
                                  parseFloat(project.fundingGoal)) *
                                  100
                              )
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <div>
                        <span className="font-semibold">
                          {project.currentAmount}
                        </span>{" "}
                        / {project.fundingGoal} MOVE
                      </div>
                      <div>
                        {project.deadline instanceof Date ? (
                          <>
                            {Math.ceil(
                              (project.deadline - new Date()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days left
                          </>
                        ) : (
                          <>Deadline: {project.deadline}</>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/projects/${project.id}`}
                      className="block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Manage Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't created any projects yet.
              </p>
              <Link
                to="/create-project"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Your First Project
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-6">My Contributions</h2>

          {myContributions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myContributions.map((project) => (
                <div
                  key={project.id}
                  className="bg-zinc-200 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-black">{project.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
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

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>
                          {Math.round(
                            (parseFloat(project.currentAmount) /
                              parseFloat(project.fundingGoal)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                (parseFloat(project.currentAmount) /
                                  parseFloat(project.fundingGoal)) *
                                  100
                              )
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <div>
                        <span className="font-semibold">
                          {project.currentAmount}
                        </span>{" "}
                        / {project.fundingGoal} MOVE
                      </div>
                      <div>
                        Your contribution: {project.contribution || "0"} MOVE
                      </div>
                    </div>

                    <Link
                      to={`/projects/${project.id}`}
                      className="block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                No Contributions Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't contributed to any projects yet.
              </p>
              <Link
                to="/projects"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse Projects
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
