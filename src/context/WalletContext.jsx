import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractService } from "../services/contractService";
import { Aptos } from "@aptos-labs/ts-sdk";

const WalletContext = createContext();

export function useWallet() {
  return useContext(WalletContext);
}

// Network configurations
const networks = {
  // Movement EVM testnet
  movement_evm: {
    chainId: "0x1B59", // 7001 in hex for Movement EVM testnet
    chainName: "Movement Testnet",
    nativeCurrency: {
      name: "MOVE",
      symbol: "MOVE",
      decimals: 18,
    },
    rpcUrls: ["https://movement-testnet-rpc.gelato.digital"],
    blockExplorerUrls: ["https://movement-testnet.blockscout.com"],
  },
  // Sepolia testnet for MetaMask
  sepolia: {
    chainId: "0xaa36a7", // 11155111 in decimal
    chainName: "Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  // Aptos network for OKX
  movement_aptos: {
    networkName: "Movement Aptos Testnet",
    nodeUrl: "https://aptos.testnet.suzuka.movementlabs.xyz/v1",
    chainId: "movement_testnet",
  },
};

// Chain IDs
const MOVEMENT_CHAIN_ID = "0x1B59"; // 7001 in hex
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in decimal

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [networkType, setNetworkType] = useState(null);
  const [error, setError] = useState(null);
  const [aptosClient, setAptosClient] = useState(null);

  // Get wallet provider based on type
  const getProvider = (type = null) => {
    const walletType = type || networkType;

    if (walletType === "evm") {
      // For MetaMask, we specifically want to use MetaMask with Sepolia
      if (window.ethereum && window.ethereum.isMetaMask) {
        setActiveWallet("metamask");
        return window.ethereum;
      }
    } else if (walletType === "aptos") {
      // For OKX, we specifically want to use OKX with Aptos
      if (typeof window.okxwallet !== "undefined" && window.okxwallet.aptos) {
        setActiveWallet("okx");
        return window.okxwallet.aptos;
      }
    }

    return null;
  };

  // Function to ensure connection to correct network based on wallet
  const ensureCorrectNetwork = async (type, wallet) => {
    const walletProvider = getProvider(type);
    if (!walletProvider) return;

    try {
      if (type === "aptos") {
        // Handle Aptos network connection for OKX
        if (wallet === "okx") {
          try {
            const network = await walletProvider.network();
            if (network !== networks.movement_aptos.chainId) {
              await walletProvider.setNetwork(networks.movement_aptos.chainId);
            }

            // Initialize Aptos client
            const aptosClient = new Aptos({
              nodeUrl: networks.movement_aptos.nodeUrl,
            });
            setAptosClient(aptosClient);
          } catch (error) {
            console.error("Error setting Aptos network:", error);
            setError("Failed to connect to Movement Aptos network");
          }
        }
      } else if (type === "evm") {
        // Handle EVM network connection
        const chainId = await walletProvider.request({ method: "eth_chainId" });

        // Different network handling based on wallet type
        if (wallet === "metamask") {
          // For MetaMask, we want to ensure it's on Sepolia
          if (chainId !== SEPOLIA_CHAIN_ID) {
            try {
              await walletProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: SEPOLIA_CHAIN_ID }],
              });
            } catch (switchError) {
              // This error code indicates that the chain has not been added to the wallet
              if (switchError.code === 4902 || switchError.code === -32603) {
                try {
                  await walletProvider.request({
                    method: "wallet_addEthereumChain",
                    params: [networks.sepolia],
                  });
                } catch (addError) {
                  console.error("Error adding Sepolia network:", addError);
                  setError(
                    "Failed to add Sepolia Network. Please add it manually."
                  );
                  return;
                }
              } else {
                throw switchError;
              }
            }
          }
        } else {
          // For other EVM wallets, ensure Movement network
          if (chainId !== MOVEMENT_CHAIN_ID) {
            try {
              await walletProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: MOVEMENT_CHAIN_ID }],
              });
            } catch (switchError) {
              // This error code indicates that the chain has not been added to the wallet
              if (switchError.code === 4902 || switchError.code === -32603) {
                try {
                  await walletProvider.request({
                    method: "wallet_addEthereumChain",
                    params: [networks.movement_evm],
                  });
                } catch (addError) {
                  console.error("Error adding Movement network:", addError);
                  setError(
                    "Failed to add Movement Network. Please add it manually."
                  );
                  return;
                }
              } else {
                throw switchError;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error ensuring correct network:", error);
      setError(
        `Failed to switch to the required network. Please try manually.`
      );
    }
  };

  // Connect wallet function for both EVM and Aptos
  const connectWallet = async (type, walletName) => {
    setNetworkType(type);

    // Get wallet provider specifically for the requested wallet
    let walletProvider;

    if (type === "evm" && walletName === "metamask") {
      // Check for MetaMask
      if (window.ethereum && window.ethereum.isMetaMask) {
        walletProvider = window.ethereum;
        setActiveWallet("metamask");
      }
    } else if (type === "aptos" && walletName === "okx") {
      // Check for OKX Aptos wallet
      if (typeof window.okxwallet !== "undefined" && window.okxwallet.aptos) {
        walletProvider = window.okxwallet.aptos;
        setActiveWallet("okx");
      }
    } else {
      // Fallback to generic provider if no specific wallet requested
      walletProvider = getProvider(type);
    }

    if (!walletProvider) {
      setError(
        `Please install a supported ${type.toUpperCase()} wallet to use this feature`
      );
      return;
    }

    try {
      if (type === "aptos") {
        // Connect Aptos wallet (OKX)
        const response = await walletProvider.connect();
        const account = response.address || response.publicKey;

        setAccount(account);
        setIsConnected(true);
        setError(null);

        // Ensure correct network for the specific wallet
        await ensureCorrectNetwork(type, activeWallet);
      } else if (type === "evm") {
        try {
          // Request account access
          const accounts = await walletProvider.request({
            method: "eth_requestAccounts",
          });

          if (!accounts || accounts.length === 0) {
            throw new Error("No accounts found");
          }

          // Create ethers provider
          const ethProvider = new ethers.BrowserProvider(walletProvider);
          setProvider(ethProvider);

          // Get signer and address
          const signer = await ethProvider.getSigner();
          const address = await signer.getAddress();

          // Ensure correct network based on which wallet it is
          await ensureCorrectNetwork(type, activeWallet);

          // Get network after ensuring correct network
          const network = await ethProvider.getNetwork();

          setSigner(signer);
          setAccount(address);
          setNetwork(network.name);
          setChainId(network.chainId);
          setIsConnected(true);
          setError(null);
        } catch (err) {
          console.error("EVM wallet connection error:", err);
          if (err.code === 4001) {
            setError("Please accept the connection request in your wallet");
          } else if (err.code === -32002) {
            setError(
              "Please check your wallet - a connection request is pending"
            );
          } else {
            setError(`Failed to connect wallet: ${err.message}`);
          }
          setIsConnected(false);
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(
        `Failed to connect ${type.toUpperCase()} wallet. Please try again.`
      );
      setIsConnected(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      if (networkType === "aptos") {
        const walletProvider = getProvider();
        if (walletProvider && walletProvider.disconnect) {
          await walletProvider.disconnect();
        }
      }

      // Clear all wallet state
      setProvider(null);
      setSigner(null);
      setAccount(null);
      setNetwork(null);
      setChainId(null);
      setIsConnected(false);
      setActiveWallet(null);
      setAptosClient(null);
      setError(null);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setError("Failed to disconnect wallet. Please try again.");
    }
  };

  // Set up event listeners for wallet changes
  useEffect(() => {
    const setupWallet = async () => {
      // Set up EVM wallet event listeners
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      }

      // Set up OKX Aptos wallet event listeners
      if (window.okxwallet && window.okxwallet.aptos) {
        window.okxwallet.aptos.onAccountChange = handleAccountChange;
        window.okxwallet.aptos.onNetworkChange = handleNetworkChange;
      }

      // Clean up function
      return async () => {
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }

        if (window.okxwallet && window.okxwallet.aptos) {
          window.okxwallet.aptos.onAccountChange = null;
          window.okxwallet.aptos.onNetworkChange = null;
        }
      };
    };

    setupWallet();
  }, []);

  // Handle account changes
  const handleAccountChange = async (newAccount) => {
    if (networkType === "aptos") {
      setAccount(newAccount);
      if (!newAccount) {
        await disconnectWallet();
      }
    }
  };

  // Handle network changes for Aptos
  const handleNetworkChange = async (newNetwork) => {
    if (networkType === "aptos") {
      await disconnectWallet();
      setError("Network changed. Please reconnect your wallet.");
    }
  };

  // Handle accounts changed for EVM
  const handleAccountsChanged = async (accounts) => {
    if (networkType === "evm") {
      if (accounts.length === 0) {
        await disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    }
  };

  // Handle chain changed for EVM
  const handleChainChanged = async (chainId) => {
    if (networkType === "evm") {
      if (activeWallet === "metamask" && chainId !== SEPOLIA_CHAIN_ID) {
        // For MetaMask we want to ensure Sepolia
        await ensureCorrectNetwork("evm", "metamask");
      } else if (activeWallet !== "metamask" && chainId !== MOVEMENT_CHAIN_ID) {
        // For other wallets, ensure Movement network
        await ensureCorrectNetwork("evm", activeWallet);
      }
      window.location.reload();
    }
  };

  // Create context value
  const value = {
    provider,
    signer,
    account,
    network,
    chainId,
    isConnected,
    activeWallet,
    networkType,
    error,
    aptosClient,
    connectWallet,
    disconnectWallet,
    contractService,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
