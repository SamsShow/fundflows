import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { getAllProjects, formatProject } from "../utils/contractUtils";

const Projects = () => {
  const { provider } = useWallet();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      if (provider) {
        try {
          const allProjects = await getAllProjects(provider);
          const formattedProjects = allProjects.map(formatProject);
          setProjects(formattedProjects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [provider]);

  // Mock data for when we don't have a provider
  useEffect(() => {
    if (!provider) {
      setProjects([
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
        {
          id: "3",
          title: "Decentralized Education Platform",
          description:
            "A blockchain-based platform for accessible and verifiable educational credentials.",
          fundingGoal: "15.0",
          currentAmount: "12.8",
          status: "Funding",
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
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
        },
        {
          id: "5",
          title: "Open Source Medical Research",
          description:
            "Funding open source research for affordable medical treatments.",
          fundingGoal: "30.0",
          currentAmount: "28.5",
          status: "Funding",
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: "6",
          title: "Decentralized Marketplace",
          description:
            "A peer-to-peer marketplace without intermediaries or fees.",
          fundingGoal: "12.0",
          currentAmount: "12.0",
          status: "Funded",
          deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ]);
      setLoading(false);
    }
  }, [provider]);

  // Filter projects based on status and search term
  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "funding" && project.status === "Funding") ||
      (filter === "funded" && project.status === "Funded") ||
      (filter === "completed" && project.status === "Completed");

    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Explore Projects</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "funding"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setFilter("funding")}
            >
              Funding
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "funded"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setFilter("funded")}
            >
              Funded
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "completed"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gray-200"></div>
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

                  <p className="text-gray-600 mb-4 line-clamp-3">
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
                    className="block w-full text-center bg-primary text-black py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria.
            </p>
            <Link
              to="/create-project"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create a Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
