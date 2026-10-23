import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainMainnet } from "./network";

export const wagmiConfig = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http("https://rpc.botchain.ai"),
  },
  ssr: true,
});
