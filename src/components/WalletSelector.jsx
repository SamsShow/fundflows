import { useState, useEffect, useRef } from "react";
import { useWallet } from "../context/WalletContext";
import { FiChevronDown, FiX } from "react-icons/fi";
import MovementLogo from "./MovementLogo";

// Supported wallets for Movement Network (Both EVM and Aptos)
const supportedWallets = [
  // Aptos-based Movement wallets
  {
    id: "petra",
    name: "Petra Wallet",
    icon: "https://petra.app/img/logo.svg",
    description: "Connect to Petra Wallet for Movement (Aptos)",
    network: "aptos",
    connector: async (connectWallet) => {
      if (typeof window.petra !== "undefined") {
        await connectWallet("aptos");
      } else {
        window.open("https://petra.app/", "_blank");
      }
    },
    isDetected: () => typeof window.petra !== "undefined",
  },
  {
    id: "martian",
    name: "Martian Wallet",
    icon: "https://martianwallet.xyz/assets/martian.png",
    description: "Connect to Martian Wallet for Movement (Aptos)",
    network: "aptos",
    connector: async (connectWallet) => {
      if (typeof window.martian !== "undefined") {
        await connectWallet("aptos");
      } else {
        window.open("https://martianwallet.xyz/", "_blank");
      }
    },
    isDetected: () => typeof window.martian !== "undefined",
  },
  {
    id: "pontem",
    name: "Pontem Wallet",
    icon: "https://pontem.network/img/logo.svg",
    description: "Connect to Pontem Wallet for Movement (Aptos)",
    network: "aptos",
    connector: async (connectWallet) => {
      if (typeof window.pontem !== "undefined") {
        await connectWallet("aptos");
      } else {
        window.open("https://pontem.network/wallet", "_blank");
      }
    },
    isDetected: () => typeof window.pontem !== "undefined",
  },
  // EVM-based Movement wallets
  {
    id: "rajor",
    name: "Rajor Wallet",
    icon: "https://rajor.app/assets/logo.png",
    description: "Connect with Rajor Wallet for Movement (EVM)",
    network: "evm",
    connector: async (connectWallet) => {
      if (typeof window.rajor !== "undefined") {
        await connectWallet("evm");
      } else {
        window.open("https://rajor.app/download", "_blank");
      }
    },
    isDetected: () => typeof window.rajor !== "undefined",
  },
  {
    id: "metamask",
    name: "MetaMask",
    icon: "https://metamask.io/images/metamask-logo.png",
    description: "Connect to MetaMask on Sepolia Testnet",
    network: "evm",
    connector: async (connectWallet) => {
      try {
        await connectWallet("evm", "metamask");
      } catch (error) {
        console.error("MetaMask connection error:", error);
      }
    },
    isDetected: () => window.ethereum && window.ethereum.isMetaMask,
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "https://www.okx.com/cdn/assets/imgs/221/C81E7B0E583D7A01.png",
    description: "Connect to OKX Wallet for Aptos",
    network: "aptos",
    connector: async (connectWallet) => {
      try {
        await connectWallet("aptos", "okx");
      } catch (error) {
        console.error("OKX wallet connection error:", error);
      }
    },
    isDetected: () =>
      typeof window.okxwallet !== "undefined" &&
      typeof window.okxwallet.aptos !== "undefined",
  },
];

const WalletSelector = () => {
  const {
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
    activeWallet,
    error,
  } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [availableWallets, setAvailableWallets] = useState([]);
  const [selectedNetworkType, setSelectedNetworkType] = useState("aptos"); // Default to Aptos

  // Update detected wallets
  useEffect(() => {
    // Filter wallets by selected network type and check availability
    const detected = supportedWallets
      .filter((wallet) => wallet.network === selectedNetworkType)
      .map((wallet) => ({
        ...wallet,
        detected: wallet.isDetected(),
      }));

    // Sort wallets: detected ones first, then alphabetically
    const sorted = detected.sort((a, b) => {
      if (a.detected && !b.detected) return -1;
      if (!a.detected && b.detected) return 1;
      return a.name.localeCompare(b.name);
    });

    setAvailableWallets(sorted);
  }, [isDropdownOpen, selectedNetworkType]);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleWalletConnect = async (wallet) => {
    setIsDropdownOpen(false);
    await wallet.connector(connectWallet);
  };

  const getActiveWalletName = () => {
    if (!activeWallet) return null;
    const wallet = supportedWallets.find((w) => w.id === activeWallet);
    return wallet ? wallet.name : activeWallet;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium px-3 py-1 bg-primary/20 text-primary-300 rounded-full">
            {formatAddress(account)}
            {activeWallet && (
              <span className="ml-1 text-xs opacity-60">
                ({getActiveWalletName()} - {selectedNetworkType.toUpperCase()})
              </span>
            )}
          </span>
          <button
            onClick={disconnectWallet}
            className="btn-outline text-sm py-2"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="btn-primary text-sm py-2 flex items-center"
          >
            <MovementLogo className="h-4 w-4 mr-2" />
            Connect Wallet
            <FiChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-neutral-50 dark:bg-neutral-500 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-400 z-50 overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-neutral-100 dark:border-neutral-400">
                <h3 className="font-medium">Connect Wallet</h3>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="p-2">
                {/* Network Type Selector */}
                <div className="flex space-x-2 p-2 mb-2 border-b border-neutral-100 dark:border-neutral-400">
                  <button
                    onClick={() => setSelectedNetworkType("aptos")}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedNetworkType === "aptos"
                        ? "bg-primary-300 text-white"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    Aptos Network
                  </button>
                  <button
                    onClick={() => setSelectedNetworkType("evm")}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedNetworkType === "evm"
                        ? "bg-primary-300 text-white"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    EVM Network
                  </button>
                </div>

                <p className="text-xs text-neutral-400 dark:text-neutral-300 px-2 py-2">
                  Connect with one of our available wallet providers for{" "}
                  {selectedNetworkType.toUpperCase()} network.
                </p>

                {availableWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletConnect(wallet)}
                    className={`flex items-center w-full p-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-400 transition-colors rounded-lg my-1 ${
                      wallet.detected ? "border-l-2 border-primary-300" : ""
                    }`}
                  >
                    <img
                      src={wallet.icon}
                      alt={`${wallet.name} logo`}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium text-neutral-600 dark:text-neutral-100 flex items-center">
                        {wallet.name}
                        {wallet.detected && (
                          <span className="ml-2 text-xs bg-primary-300/20 text-primary-300 px-1.5 py-0.5 rounded">
                            Detected
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 dark:text-neutral-300">
                        {wallet.description}
                      </div>
                      {!wallet.detected && (
                        <div className="text-xs text-amber-500 mt-1">
                          Not installed - Click to install
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-neutral-100 dark:bg-neutral-600 text-xs text-neutral-500 dark:text-neutral-300 text-center">
                <p>
                  Don't have a wallet? Visit{" "}
                  <a
                    href="https://movementlabs.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:underline"
                  >
                    Movement Labs
                  </a>{" "}
                  to learn more
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WalletSelector;
