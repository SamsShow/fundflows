import { useState, useEffect, useRef } from "react";
import { useWallet } from "../context/WalletContext";
import MovementLogo from "./MovementLogo";
import { FiChevronDown, FiCheck } from "react-icons/fi";

// Only Movement Network
const networks = [
  {
    id: "movement",
    name: "Movement Bardock Testnet",
    icon: <MovementLogo className="h-4 w-4" />,
    chainId: "0xFA", // 250 in hex
    rpcUrl: "https://aptos.testnet.bardock.movementlabs.xyz/v1",
    currency: "MOVE",
  },
];

const NetworkSwitcher = () => {
  const { currentNetwork, error } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      </button>
    </div>
  );
};

export default NetworkSwitcher;
