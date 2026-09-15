import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const BOTCHAIN_CHAIN_ID = Number((process.env.NEXT_PUBLIC_BOTCHAIN_CHAIN_ID || "968").trim());
export const BOTCHAIN_RPC_URL = (process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life").trim();
export const BOTCHAIN_EXPLORER_URL = (process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL || "https://scan.bohr.life").trim();

export const botchain = defineChain({
  id: BOTCHAIN_CHAIN_ID,
  name: "Botchain Testnet",
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
      name: "Bohr Explorer",
      url: BOTCHAIN_EXPLORER_URL,
    },
  },
  testnet: true,
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
