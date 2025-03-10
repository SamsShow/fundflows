import { useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import ThemeToggle from "./ThemeToggle";
import MovementLogo from "./MovementLogo";
import NetworkSwitcher from "./NetworkSwitcher";
import { FiMenu, FiX, FiExternalLink } from "react-icons/fi";

const Navbar = () => {
  const { isConnected, account, connectWallet, disconnectWallet } = useWallet();
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
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-1">
            <Link to="/" className="flex items-center">
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
            </Link>
          </div>

          {/* Desktop Navigation */}
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

            {isConnected ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium px-3 py-1 bg-primary/20 text-primary-300 rounded-full">
                  {formatAddress(account)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="btn-outline text-sm py-2"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-primary text-sm py-2 flex items-center"
              >
                <MovementLogo className="h-4 w-4 mr-2" />
                Connect Wallet
              </button>
            )}
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
          <div className="md:hidden py-6 border-t border-neutral-100 dark:border-neutral-500">
            <div className="flex flex-col space-y-6">
              <Link
                to="/"
                className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                to="/create-project"
                className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Project
              </Link>
              {isConnected && (
                <Link
                  to="/dashboard"
                  className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <a
                href="https://movementlabs.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neutral-400 dark:text-neutral-200 hover:text-primary-300 dark:hover:text-primary transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <MovementLogo className="h-4 w-4 mr-1" />
                Movement <FiExternalLink className="ml-1 h-4 w-4" />
              </a>

              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-500">
                {isConnected ? (
                  <div className="flex flex-col space-y-4">
                    <span className="text-sm font-medium px-3 py-1 bg-primary/20 text-primary-300 rounded-full self-start">
                      {formatAddress(account)}
                    </span>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setIsMenuOpen(false);
                      }}
                      className="btn-outline text-sm py-2"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connectWallet();
                      setIsMenuOpen(false);
                    }}
                    className="btn-primary text-sm py-2 w-full flex items-center justify-center"
                  >
                    <MovementLogo className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
