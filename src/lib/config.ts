import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const BOTCHAIN_CHAIN_ID = Number((process.env.NEXT_PUBLIC_BOTCHAIN_CHAIN_ID || "677").trim());
export const BOTCHAIN_RPC_URL = (process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai").trim();
export const BOTCHAIN_EXPLORER_URL = (process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL || "https://scan.botchain.ai").trim();

export const botchain = defineChain({
  id: BOTCHAIN_CHAIN_ID,
  name: "Botchain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "BOT",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: [BOTCHAIN_RPC_URL],
    },
    public: {
      http: [BOTCHAIN_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Botchain Explorer",
      url: BOTCHAIN_EXPLORER_URL,
    },
  },
  testnet: false,
});

export const config = createConfig({
  chains: [botchain],
  connectors: [
    injected(),
  ],
  transports: {
    [botchain.id]: http(BOTCHAIN_RPC_URL),
  },
});
