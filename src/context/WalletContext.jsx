import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export function useWallet() {
  return useContext(WalletContext);
}

// Only Movement Network configuration
const networks = {
  movement: {
    chainId: "0xFA", // 250 in hex for Movement Bardock testnet
    chainName: "Movement Bardock Testnet",
    nativeCurrency: {
      name: "MOVE",
      symbol: "MOVE",
      decimals: 18,
    },
    rpcUrls: ["https://aptos.testnet.bardock.movementlabs.xyz/v1"],
    blockExplorerUrls: ["https://explorer.movementlabs.xyz/"],
  },
};

// Fantom Network to check and avoid conflicts
const FANTOM_CHAIN_ID = "0xFA";

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState("movement");
  const [error, setError] = useState(null);
  const [activeWallet, setActiveWallet] = useState(null);

  // Function to get provider based on available wallets
  const getProvider = () => {
    // Check for Rajor wallet
    if (typeof window.rajor !== "undefined") {
      setActiveWallet("rajor");
      return window.rajor;
    }
    // Check for OKX wallet
    else if (typeof window.okxwallet !== "undefined") {
      setActiveWallet("okx");
      return window.okxwallet;
    }
    // Then check for MetaMask
    else if (typeof window.ethereum !== "undefined") {
      setActiveWallet("metamask");
      return window.ethereum;
    }
    return null;
  };

  // Function to ensure connection to Movement Network
  const ensureMovementNetwork = async () => {
    const walletProvider = getProvider();
    if (!walletProvider) return;

    try {
      // Get current chain ID
      const chainId = await walletProvider.request({ method: "eth_chainId" });

      // Check if we're on Fantom network (also has chainId 0xFA)
      const isFantom =
        chainId === FANTOM_CHAIN_ID &&
        activeWallet === "okx" &&
        !(await isMovementNetwork(walletProvider, chainId));

      if (chainId !== networks.movement.chainId || isFantom) {
        await switchNetwork("movement");
      }
    } catch (error) {
      console.error("Error ensuring Movement network:", error);
      setError("Please switch to Movement Bardock Testnet");
    }
  };

  // Helper function to check if we're on Movement Network rather than Fantom
  const isMovementNetwork = async (walletProvider, chainId) => {
    if (chainId !== FANTOM_CHAIN_ID) return false;

    try {
      // Try to get network information to differentiate between Movement and Fantom
      const provider = new ethers.BrowserProvider(walletProvider);
      const network = await provider.getNetwork();

      // Check network name or other properties
      return network.name === "Movement" || network.name.includes("Movement");
    } catch (error) {
      console.error("Error checking network:", error);
      return false;
    }
  };

  useEffect(() => {
    // Get available wallet provider
    const walletProvider = getProvider();

    if (walletProvider) {
      try {
        // Create a provider instance
        const provider = new ethers.BrowserProvider(walletProvider);
        setProvider(provider);

        // Check if already connected
        checkConnection(provider);

        // Listen for account changes
        walletProvider.on("accountsChanged", handleAccountsChanged);

        // Listen for chain changes
        walletProvider.on("chainChanged", handleChainChanged);
      } catch (error) {
        console.error("Error initializing wallet provider:", error);
        setError("Failed to initialize wallet connection");
      }
    }

    return () => {
      // Clean up event listeners
      const walletProvider = getProvider();
      if (walletProvider) {
        walletProvider.removeListener("accountsChanged", handleAccountsChanged);
        walletProvider.removeListener("chainChanged", handleChainChanged);
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
        setError(null);

        // Check if we're on Movement Network or Fantom
        const hexChainId = "0x" + chainId.toString(16);
        const walletProvider = getProvider();

        if (
          hexChainId === networks.movement.chainId &&
          !(
            hexChainId === FANTOM_CHAIN_ID &&
            !(await isMovementNetwork(walletProvider, hexChainId))
          )
        ) {
          setCurrentNetwork("movement");
        } else {
          // If not on Movement Network, switch to it
          await ensureMovementNetwork();
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setError("Failed to check wallet connection");
      setIsConnected(false);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    try {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setIsConnected(false);
        setAccount(null);
        setSigner(null);
        setError(null);
      } else {
        // Account changed, update state
        if (provider) {
          const signer = await provider.getSigner();
          setSigner(signer);
          setAccount(accounts[0]);
          setIsConnected(true);
          setError(null);
          // Ensure we're on Movement Network when account changes
          await ensureMovementNetwork();
        }
      }
    } catch (error) {
      console.error("Error handling account change:", error);
      setError("Failed to update wallet connection");
    }
  };

  const handleChainChanged = async (chainId) => {
    const walletProvider = getProvider();

    // Check if the new chain is Fantom instead of Movement
    const isFantom =
      chainId === FANTOM_CHAIN_ID &&
      activeWallet === "okx" &&
      !(await isMovementNetwork(walletProvider, chainId));

    // Always ensure on Movement Network
    if (chainId !== networks.movement.chainId || isFantom) {
      await ensureMovementNetwork();
    }

    // Refresh the page to ensure clean state
    window.location.reload();
  };

  const connectWallet = async () => {
    const walletProvider = getProvider();

    if (!walletProvider) {
      setError(
        "Please install a supported wallet (MetaMask, OKX, or Rajor) to use this feature"
      );
      return;
    }

    try {
      // Different request method depending on wallet
      if (activeWallet === "rajor") {
        // Rajor specific connection method
        await walletProvider.connect();
      } else {
        // Standard EIP-1102 method for MetaMask and OKX
        await walletProvider.request({ method: "eth_requestAccounts" });
      }

      // Create a new provider since we now have permission
      const ethProvider = new ethers.BrowserProvider(walletProvider);
      setProvider(ethProvider);

      // Ensure we're on Movement Network before proceeding
      await ensureMovementNetwork();

      const signer = await ethProvider.getSigner();
      const address = await signer.getAddress();
      const network = await ethProvider.getNetwork();
      const chainId = network.chainId;

      setSigner(signer);
      setAccount(address);
      setNetwork(network.name);
      setChainId(chainId);
      setIsConnected(true);
      setError(null);

      // Set current network
      setCurrentNetwork("movement");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Failed to connect wallet. Please try again.");
      setIsConnected(false);
    }
  };

  const disconnectWallet = () => {
    // Rajor-specific disconnect
    if (
      activeWallet === "rajor" &&
      window.rajor &&
      typeof window.rajor.disconnect === "function"
    ) {
      try {
        window.rajor.disconnect();
      } catch (error) {
        console.error("Error disconnecting Rajor wallet:", error);
      }
    }

    setIsConnected(false);
    setAccount(null);
    setSigner(null);
    setActiveWallet(null);
    setError(null);
  };

  const switchNetwork = async (networkId) => {
    const walletProvider = getProvider();

    if (!walletProvider) {
      setError("Please install a supported wallet to use this feature");
      return;
    }

    const networkConfig = networks[networkId];
    if (!networkConfig) {
      console.error("Invalid network selected");
      setError("Invalid network selected");
      return;
    }

    try {
      // For OKX wallet on Fantom, we need a special handling
      if (
        activeWallet === "okx" &&
        (await isMovementNetwork(walletProvider, networkConfig.chainId)) ===
          false
      ) {
        setError(
          "OKX wallet may be connected to Fantom instead of Movement. Please manually add Movement Network in your wallet settings."
        );
        return;
      }

      // Rajor-specific network switching if available
      if (
        activeWallet === "rajor" &&
        typeof walletProvider.switchNetwork === "function"
      ) {
        await walletProvider.switchNetwork(networkConfig.chainId);
        setCurrentNetwork(networkId);
        setError(null);
        return;
      }

      // Standard EIP-3326 method for other wallets
      try {
        await walletProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networkConfig.chainId }],
        });
        setCurrentNetwork(networkId);
        setError(null);
      } catch (switchError) {
        // This error code indicates that the chain has not been added to wallet
        if (switchError.code === 4902) {
          try {
            await walletProvider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: networkConfig.chainId,
                  chainName: networkConfig.chainName,
                  nativeCurrency: networkConfig.nativeCurrency,
                  rpcUrls: networkConfig.rpcUrls,
                  blockExplorerUrls: networkConfig.blockExplorerUrls,
                },
              ],
            });

            // After adding, try to switch to it
            await walletProvider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: networkConfig.chainId }],
            });

            setCurrentNetwork(networkId);
            setError(null);
          } catch (addError) {
            console.error("Error adding network:", addError);
            setError(
              "Failed to add Movement Network. Please add it manually in your wallet."
            );
          }
        } else {
          throw switchError;
        }
      }
    } catch (error) {
      console.error("Error switching network:", error);
      setError(
        "Failed to switch network. Please try again or add Movement Network manually in your wallet settings."
      );
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
    activeWallet,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
