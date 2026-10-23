import { defineChain } from "viem";

/**
 * Botchain Mainnet Network Specification
 * Chain ID: 677
 * RPC URL: https://rpc.botchain.ai
 * Explorer: https://scan.botchain.ai
 * Native Currency: BOT
 * Total Supply: 150 Million BOT
 */
export const botchainMainnet = defineChain({
  id: 677,
  name: "Botchain Mainnet",
  nativeCurrency: {
    name: "BOT",
    symbol: "BOT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.botchain.ai"],
    },
  },
  blockExplorers: {
    default: {
      name: "BotchainScan",
      url: "https://scan.botchain.ai",
    },
  },
  testnet: false,
});

// Primary chain for LuckyNumber dApp
export const defaultChain = botchainMainnet;
