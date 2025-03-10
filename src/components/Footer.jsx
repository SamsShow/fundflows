import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiExternalLink } from "react-icons/fi";
import MovementLogo from "./MovementLogo";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-neutral-600 border-t border-neutral-100 dark:border-neutral-500 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold bg-clip-text text-transparent movement-gradient">
                FundFlow
              </span>
              <div className="ml-2 flex items-center bg-primary/10 px-2 py-0.5 rounded-md">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-200">
                  on
                </span>
                <div className="flex items-center ml-1">
                  <MovementLogo className="h-4 w-4 mr-1" />
                  <span className="text-xs font-bold text-primary-400 dark:text-primary-300">
                    Movement
                  </span>
                </div>
              </div>
            </div>
            <p className="text-neutral-400 dark:text-neutral-200 mb-4">
              Decentralized crowdfunding powered by Movement blockchain
              technology
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/movement-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/movementlabsxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-neutral-500 dark:text-neutral-100">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                >
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/create-project"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                >
                  Create Project
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-neutral-500 dark:text-neutral-100">
              About Movement
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://movement.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors flex items-center"
                >
                  <MovementLogo className="h-4 w-4 mr-1" />
                  Movement Labs <FiExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.movementlabs.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors flex items-center"
                >
                  Documentation <FiExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/movement-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors flex items-center"
                >
                  GitHub <FiExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://movementlabs.xyz/ecosystem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors flex items-center"
                >
                  Ecosystem <FiExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-neutral-500 dark:text-neutral-100">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-500 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 dark:text-neutral-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} FundFlow. All rights reserved.
          </p>
          <div className="flex items-center">
            <span className="text-neutral-400 dark:text-neutral-300 text-sm">
              Powered by
            </span>
            <a
              href="https://movement.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center"
            >
              <MovementLogo className="h-4 w-4 mr-1" />
              <span className="font-semibold text-sm text-primary-300">
                Movement Blockchain
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
