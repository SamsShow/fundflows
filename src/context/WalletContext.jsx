import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export function useWallet() {
  return useContext(WalletContext);
}

const networks = {
  movement: {
    chainId: "0x77EC", // 30732 in hex
    chainName: "Movement Testnet",
    nativeCurrency: {
      name: "MOVE",
      symbol: "MOVE",
      decimals: 18,
    },
    rpcUrls: ["https://testnet.movementlabs.xyz"],
    blockExplorerUrls: ["https://explorer.testnet.movementlabs.xyz"],
  },
  ethereum: {
    chainId: "0x5", // 5 in hex for Goerli
    chainName: "Ethereum Goerli Testnet",
    nativeCurrency: {
      name: "Goerli ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://goerli.infura.io/v3/your-infura-key"],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
  },
};

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState("movement");

  useEffect(() => {
    // Check if window.ethereum is defined (MetaMask is installed)
    if (typeof window.ethereum !== "undefined") {
      // Create a provider instance
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      // Check if already connected
      checkConnection(provider);

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Listen for chain changes
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async (provider) => {
    try {
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const chainId = network.chainId;

        setSigner(signer);
        setAccount(accounts[0].address);
        setNetwork(network.name);
        setChainId(chainId);
        setIsConnected(true);

        // Determine which network is currently connected
        const hexChainId = "0x" + chainId.toString(16);
        if (hexChainId === networks.movement.chainId) {
          setCurrentNetwork("movement");
        } else if (hexChainId === networks.ethereum.chainId) {
          setCurrentNetwork("ethereum");
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setIsConnected(false);
      setAccount(null);
      setSigner(null);
    } else {
      // Account changed, update state
      if (provider) {
        const signer = await provider.getSigner();
        setSigner(signer);
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    }
  };

  const handleChainChanged = (chainId) => {
    // When the chain changes, refresh the page as recommended by MetaMask
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!provider) {
      alert("Please install MetaMask to use this feature");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      setSigner(signer);
      setAccount(address);
      setNetwork(network.name);
      setChainId(chainId);
      setIsConnected(true);

      // Determine which network is currently connected
      const hexChainId = "0x" + chainId.toString(16);
      if (hexChainId === networks.movement.chainId) {
        setCurrentNetwork("movement");
      } else if (hexChainId === networks.ethereum.chainId) {
        setCurrentNetwork("ethereum");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setSigner(null);
  };

  const switchNetwork = async (networkId) => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature");
      return;
    }

    const networkConfig = networks[networkId];
    if (!networkConfig) {
      console.error("Invalid network selected");
      return;
    }

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkConfig.chainId }],
      });

      setCurrentNetwork(networkId);
    } catch (switchError) {
      // If the network is not added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [networkConfig],
          });

          setCurrentNetwork(networkId);
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      } else {
        console.error("Error switching network:", switchError);
      }
    }
  };

  const value = {
    provider,
    signer,
    account,
    network,
    chainId,
    isConnected,
    currentNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
