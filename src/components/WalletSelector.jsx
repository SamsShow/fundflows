import { useState, useEffect, useRef } from "react";
import { useWallet } from "../context/WalletContext";
import { FiChevronDown, FiX } from "react-icons/fi";
import MovementLogo from "./MovementLogo";

// Supported wallets for Movement Network
const supportedWallets = [
  {
    id: "rajor",
    name: "Rajor Wallet",
    icon: "https://rajor.app/assets/logo.png",
    description: "Connect with Rajor Wallet for Movement (Recommended)",
    connector: async (connectWallet) => {
      if (typeof window.rajor !== "undefined") {
        await connectWallet();
      } else {
        window.open("https://rajor.app/download", "_blank");
      }
    },
    isDetected: () => typeof window.rajor !== "undefined",
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "https://public.bnbstatic.com/static/images/common/okx.png",
    description: "Connect with OKX Wallet",
    connector: async (connectWallet) => {
      if (typeof window.okxwallet !== "undefined") {
        await connectWallet();
      } else {
        window.open("https://www.okx.com/web3", "_blank");
      }
    },
    isDetected: () => typeof window.okxwallet !== "undefined",
  },
  {
    id: "metamask",
    name: "MetaMask",
    icon: "https://metamask.io/images/metamask-logo.png",
    description: "Connect to your MetaMask Wallet",
    connector: async (connectWallet) => {
      if (typeof window.ethereum !== "undefined") {
        await connectWallet();
      } else {
        window.open("https://metamask.io/download/", "_blank");
      }
    },
    isDetected: () => typeof window.ethereum !== "undefined",
  },
  {
    id: "petra",
    name: "Petra Wallet",
    icon: "https://petra.app/img/logo.svg",
    description: "Connect to Petra Wallet (for Movement)",
    connector: () => {
      window.open("https://petra.app/", "_blank");
    },
    isDetected: () => typeof window.petra !== "undefined",
  },
  {
    id: "martian",
    name: "Martian Wallet",
    icon: "https://martianwallet.xyz/assets/martian.png",
    description: "Connect to Martian Wallet (for Movement)",
    connector: () => {
      window.open("https://martianwallet.xyz/", "_blank");
    },
    isDetected: () => typeof window.martian !== "undefined",
  },
  {
    id: "pontem",
    name: "Pontem Wallet",
    icon: "https://pontem.network/img/logo.svg",
    description: "Connect to Pontem Wallet (for Movement)",
    connector: () => {
      window.open("https://pontem.network/wallet", "_blank");
    },
  },
];

const WalletSelector = () => {
  const {
    connectWallet,
    isConnected,
    account,
    disconnectWallet,
    activeWallet,
  } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [availableWallets, setAvailableWallets] = useState([]);

  // Update detected wallets
  useEffect(() => {
    // Check which wallets are available in the browser
    const detected = supportedWallets.map((wallet) => ({
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
  }, [isOpen]);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleWalletConnect = async (wallet) => {
    await wallet.connector(connectWallet);
    setIsOpen(false);
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
                ({getActiveWalletName()})
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
            onClick={() => setIsOpen(!isOpen)}
            className="btn-primary text-sm py-2 flex items-center"
          >
            <MovementLogo className="h-4 w-4 mr-2" />
            Connect Wallet
            <FiChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-neutral-50 dark:bg-neutral-500 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-400 z-50 overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-neutral-100 dark:border-neutral-400">
                <h3 className="font-medium">Connect Wallet</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="p-2">
                <p className="text-xs text-neutral-400 dark:text-neutral-300 px-2 py-2">
                  Connect with one of our available wallet providers to get
                  started with Movement Network.
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
