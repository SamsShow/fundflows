import { useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import ThemeToggle from "./ThemeToggle";
import MovementLogo from "./MovementLogo";
import NetworkSwitcher from "./NetworkSwitcher";
import WalletSelector from "./WalletSelector";
import { FiMenu, FiX, FiExternalLink } from "react-icons/fi";

const Navbar = () => {
  const { isConnected, account, error } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-neutral-50 dark:bg-neutral-600 border-b border-neutral-100 dark:border-neutral-500 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 w-full">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-error/10 text-error px-4 py-2 text-sm text-center">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-1">
            <Link to="/" className="flex items-center space-x-2">
              <MovementLogo className="h-8 w-8" />
              <span className="font-bold text-xl">FundFlows</span>
            </Link>
          </div>

          {/* Main navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/projects"
              className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
            >
              Projects
            </Link>
            <Link
              to="/create-project"
              className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
            >
              Create Project
            </Link>
            {isConnected && (
              <Link
                to="/dashboard"
                className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
            <a
              href="https://movementlabs.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors flex items-center"
            >
              <MovementLogo className="h-4 w-4 mr-1" />
              Movement <FiExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>

          {/* Wallet Connection, Network Switcher and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isConnected && <NetworkSwitcher />}
            <WalletSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            {isConnected && <NetworkSwitcher />}
            <button
              onClick={toggleMenu}
              className="text-neutral-500 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 dark:border-neutral-500 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors px-2 py-1"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors px-2 py-1"
              >
                Projects
              </Link>
              <Link
                to="/create-project"
                className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors px-2 py-1"
              >
                Create Project
              </Link>
              {isConnected && (
                <Link
                  to="/dashboard"
                  className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors px-2 py-1"
                >
                  Dashboard
                </Link>
              )}
              <a
                href="https://movementlabs.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors flex items-center px-2 py-1"
              >
                <MovementLogo className="h-4 w-4 mr-1" />
                Movement <FiExternalLink className="ml-1 h-4 w-4" />
              </a>
              <div className="mt-4 px-2">
                <WalletSelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
