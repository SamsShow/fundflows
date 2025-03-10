import { useState, useEffect, useRef } from "react";
import { useWallet } from "../context/WalletContext";
import MovementLogo from "./MovementLogo";
import { FiChevronDown, FiCheck } from "react-icons/fi";

const networks = [
  {
    id: "movement",
    name: "Movement Testnet",
    icon: <MovementLogo className="h-4 w-4" />,
    chainId: "30732",
    rpcUrl: "https://testnet.movementlabs.xyz",
    currency: "MOVE",
  },
  {
    id: "ethereum",
    name: "Ethereum Goerli",
    icon: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L4.5 12L12 22L19.5 12L12 2Z" fill="#627EEA" />
        <path d="M12 2L4.5 12L12 16V2Z" fillOpacity="0.6" fill="white" />
        <path d="M12 16L4.5 12L12 22V16Z" fillOpacity="0.6" fill="white" />
        <path d="M12 2L19.5 12L12 16V2Z" fillOpacity="0.2" fill="white" />
        <path d="M12 16L19.5 12L12 22V16Z" fillOpacity="0.2" fill="white" />
      </svg>
    ),
    chainId: "5",
    rpcUrl: "https://goerli.infura.io/v3/your-infura-key",
    currency: "ETH",
  },
];

const NetworkSwitcher = () => {
  const { currentNetwork, switchNetwork } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleNetworkSwitch = (networkId) => {
    if (networkId !== currentNetwork) {
      switchNetwork(networkId);
    }
    setIsOpen(false);
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

  const activeNetwork =
    networks.find((network) => network.id === currentNetwork) || networks[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-400 transition-colors text-sm"
      >
        <span className="flex items-center">
          {activeNetwork.icon}
          <span className="ml-2 font-medium">{activeNetwork.name}</span>
        </span>
        <FiChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-neutral-50 dark:bg-neutral-500 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-400 z-50">
          <div className="py-2">
            <div className="px-4 py-2 text-xs text-neutral-400 dark:text-neutral-300 font-medium">
              Select Network
            </div>
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-400 transition-colors"
              >
                <div className="flex items-center">
                  {network.icon}
                  <div className="ml-2">
                    <div className="font-medium text-neutral-600 dark:text-neutral-100">
                      {network.name}
                    </div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-300">
                      {network.currency}
                    </div>
                  </div>
                </div>
                {currentNetwork === network.id && (
                  <FiCheck className="h-5 w-5 text-primary-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSwitcher;
