import { defineChain } from "viem";

/**
 * Botchain Testnet Network Specification
 * Chain ID: 968
 * RPC URL: https://rpc.bohr.life
 * Explorer: https://scan.bohr.life
 * Native Currency: BOT
 */
export const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: {
    name: "BOT",
    symbol: "BOT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bohr.life"],
    },
  },
  blockExplorers: {
    default: {
      name: "BohrScan",
      url: "https://scan.bohr.life",
    },
  },
  testnet: true,
});
