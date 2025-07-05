// Smart contract addresses and configuration
export const CONTRACTS = {
  // Payment processor program ID from your contract
  PAYMENT_PROCESSOR: "FnU7z1SdyeKD3LKevjauAP4U8sYQsoyWdMatjuMA5vYq",
}

// Network configuration
export const NETWORK_CONFIG = {
  devnet: {
    name: "Devnet",
    rpcUrl: "https://api.devnet.solana.com",
    explorerUrl: "https://explorer.solana.com",
  },
  mainnet: {
    name: "Mainnet",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    explorerUrl: "https://explorer.solana.com",
  },
}

// Transaction configuration
export const TRANSACTION_CONFIG = {
  commitment: "confirmed",
  timeout: 60000,
  maxRetries: 3,
}
