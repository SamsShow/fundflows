import { Link } from "react-router-dom";
import MovementLogo from "./MovementLogo";

const Hero = () => {
  return (
    <div className="hero-section">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="bg-primary/5 px-3 py-1.5 rounded-full flex items-center mb-6">
            <MovementLogo className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium text-primary-300">
              Built on Movement and Ethereum Testnets
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-600 dark:text-white">
            Decentralized Crowdfunding
            <span className="text-transparent bg-clip-text movement-gradient">
              {" "}
              Powered by Movement
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-200 mb-10 max-w-3xl">
            Fund innovative projects with milestone-based releases, transparent
            voting, and no intermediaries. Your contribution goes directly to
            creators.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/projects" className="btn-primary px-8 py-4 text-center">
              Explore Projects
            </Link>
            <Link
              to="/create-project"
              className="btn-outline px-8 py-4 text-center"
            >
              Start a Project
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neutral-50 dark:bg-neutral-500/50 rounded-xl p-6 shadow-md border border-neutral-100 dark:border-neutral-400">
            <div className="bg-primary-50 dark:bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary-400 font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-neutral-600 dark:text-white">
              Define Your Project
            </h3>
            <p className="text-neutral-500 dark:text-neutral-200">
              Define your funding goals, milestones, and deadlines. Set up your
              project with all the details backers need.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-500/50 rounded-xl p-6 shadow-md border border-neutral-100 dark:border-neutral-400">
            <div className="bg-primary-50 dark:bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary-400 font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-neutral-600 dark:text-white">
              Direct Contributions
            </h3>
            <p className="text-neutral-500 dark:text-neutral-200">
              Backers contribute funds directly to your project's smart
              contract. No intermediaries, no hidden fees.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-500/50 rounded-xl p-6 shadow-md border border-neutral-100 dark:border-neutral-400">
            <div className="bg-primary-50 dark:bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary-400 font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-neutral-600 dark:text-white">
              Milestone-Based Funding
            </h3>
            <p className="text-neutral-500 dark:text-neutral-200">
              Funds are released as you complete milestones. Backers vote on
              milestone completion for transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
