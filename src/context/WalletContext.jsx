import { createContext, useState, useContext, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if window.ethereum is available
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          // Get accounts
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            setIsConnected(true);

            // Get signer
            const signer = await provider.getSigner();
            setSigner(signer);

            // Get chain ID
            const network = await provider.getNetwork();
            setChainId(network.chainId);
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setError(error.message);
      }
    };

    checkConnection();
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
          setSigner(null);
        }
      };

      const handleChainChanged = (chainId) => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        // Request accounts
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Get accounts
        const accounts = await provider.listAccounts();
        setAccount(accounts[0].address);
        setIsConnected(true);

        // Get signer
        const signer = await provider.getSigner();
        setSigner(signer);

        // Get chain ID
        const network = await provider.getNetwork();
        setChainId(network.chainId);

        setError(null);
      } else {
        setError("Please install a Movement Labs compatible wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error.message);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setSigner(null);
    setChainId(null);
  };

  const value = {
    isConnected,
    account,
    provider,
    signer,
    chainId,
    error,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
