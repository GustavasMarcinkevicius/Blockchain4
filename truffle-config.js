module.exports = {
  compilers: {
    solc: {
      version: "0.8.21",
    },
  },

  // Tinklai
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Ganache GUI default port
      network_id: "*",
    },

    sepolia: {
      provider: () =>
        new HDWalletProvider(
          "TAVO_METAMASK_MNEMONIC",
          "https://sepolia.infura.io/v3/TAVO_INFURA_KEY"
        ),
      network_id: 11155111, // Sepolia network ID
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
};
