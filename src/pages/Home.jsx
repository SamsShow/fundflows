import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { getAllProjects, formatProject } from "../utils/contractUtils";

const Home = () => {
  const { provider, isConnected } = useWallet();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (provider) {
        try {
          const projects = await getAllProjects(provider);
          // Get the 3 most recent projects for the featured section
          const formattedProjects = projects
            .map(formatProject)
            .sort((a, b) => b.id - a.id)
            .slice(0, 3);

          setFeaturedProjects(formattedProjects);
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
      setFeaturedProjects([
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
      ]);
      setLoading(false);
    }
  }, [provider]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Fund the Future with FundFlow
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A decentralized crowdfunding platform built on Movement Labs
            blockchain. Transparent, secure, and milestone-based funding for
            innovative projects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/projects"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Projects
            </Link>
            <Link
              to="/create-project"
              className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How FundFlow Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create a Project</h3>
              <p className="text-gray-600">
                Define your funding goals, milestones, and deadlines. Set up
                your project with all the details backers need.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Funded</h3>
              <p className="text-gray-600">
                Backers contribute funds directly to your project's smart
                contract. No intermediaries, no hidden fees.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Achieve Milestones</h3>
              <p className="text-gray-600">
                Funds are released as you complete milestones. Backers vote on
                milestone completion for transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Link
              to="/projects"
              className="text-primary hover:text-primary/80 font-semibold"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h3>
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
                      className="block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-neutral text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Launch Your Project?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the decentralized funding revolution and bring your ideas to
            life with transparent, milestone-based funding.
          </p>
          <Link
            to="/create-project"
            className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors inline-block"
          >
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
