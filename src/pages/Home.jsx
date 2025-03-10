import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { getAllProjects, formatProject } from "../utils/contractUtils";
import Hero from "../components/Hero";
import MovementLogo from "../components/MovementLogo";
import { FiArrowRight } from "react-icons/fi";

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
    <div className="w-full min-h-screen">
      <Hero />

      {/* Featured Projects Section */}
      <section className="section w-full py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-neutral-500 dark:text-neutral-200 text-lg max-w-3xl mx-auto">
              Discover innovative projects that are shaping the future of
              decentralized crowdfunding on Movement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Project Cards */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-neutral-50 dark:bg-neutral-500 rounded-xl shadow-md border border-neutral-100 dark:border-neutral-400 overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9 bg-neutral-100 dark:bg-neutral-400"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-primary/10 text-primary-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Technology
                    </span>
                    <span className="bg-success/10 text-success text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Project Title {i}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-200 mb-4">
                    A brief description of the project and its goals. This is a
                    placeholder text.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-500 dark:text-neutral-200">
                        Progress
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-200">
                        75%
                      </span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-200">
                        Raised
                      </p>
                      <p className="font-semibold">75,000 MOVE</p>
                    </div>
                    <Link
                      to={`/projects/${i}`}
                      className="btn-primary flex items-center"
                    >
                      View Project
                      <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="btn-outline inline-flex items-center"
            >
              View All Projects
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section w-full bg-neutral-50 dark:bg-neutral-500/30 py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-neutral-500 dark:text-neutral-200 text-lg max-w-3xl mx-auto">
              FundFlow makes decentralized crowdfunding simple and transparent
              for both creators and backers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-50 dark:bg-neutral-500 rounded-xl p-6 shadow-md border border-neutral-100 dark:border-neutral-400">
              <div className="bg-primary-50 dark:bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary-400 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create a Project</h3>
              <p className="text-neutral-500 dark:text-neutral-200">
                Define your project goals, funding requirements, and milestones.
                Set up your campaign in minutes.
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-500 rounded-xl p-6 shadow-md border border-neutral-100 dark:border-neutral-400">
              <div className="bg-primary-50 dark:bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary-400 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Funded</h3>
              <p className="text-neutral-500 dark:text-neutral-200">
                Receive contributions directly to your project's smart contract.
                Track funding progress in real-time.
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-500 rounded-xl p-6 shadow-md border border-neutral-100 dark:border-neutral-400">
              <div className="bg-primary-50 dark:bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary-400 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Deliver & Grow</h3>
              <p className="text-neutral-500 dark:text-neutral-200">
                Complete milestones, receive funding, and build your project
                with community support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section w-full py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-50 dark:bg-neutral-500 rounded-xl p-12 shadow-md border border-neutral-100 dark:border-neutral-400 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Launch Your Project?
              </h2>
              <p className="text-neutral-500 dark:text-neutral-200 text-lg mb-8">
                Join the future of decentralized crowdfunding. Create your
                project today and connect with backers who believe in your
                vision.
              </p>
              <Link to="/create-project" className="btn-primary inline-block">
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
