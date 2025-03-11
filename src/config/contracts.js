export const CONTRACT_CONFIG = {
  // Deployed contract address
  FUNDFLOW_ADDRESS:
    "0xd5ff7fd86cd844e54533482fbca61e5b2a7159242d5fff1cc16337c75fac4b59",

  // Transaction hash for reference
  DEPLOYMENT_TX_HASH:
    "0xf7a373289b1c4d41cdfa6b1c95f9de61d9c02755dc2bc2d7e02dae3b5911cd23",

  NETWORK: {
    testnet: {
      // Movement Aptos Testnet (Suzuka)
      aptosNodeUrl: "https://aptos.testnet.suzuka.movementlabs.xyz/v1",
      aptosChainId: "movement_testnet",

      // Sepolia Testnet (for MetaMask)
      sepoliaNodeUrl: "https://rpc.sepolia.org",
      sepoliaChainId: "11155111",

      // Movement EVM Testnet
      movementNodeUrl: "https://movement-testnet-rpc.gelato.digital",
      movementChainId: "7001",
    },
  },
};
