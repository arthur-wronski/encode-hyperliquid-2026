'use client';

import { createConfig as createWagmiConfig } from 'wagmi';
import { mainnet, arbitrum, optimism, base, polygon, bsc } from 'wagmi/chains';
import { http } from 'viem';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createWagmiConfig({
  chains: [mainnet, arbitrum, optimism, base, polygon, bsc],
  connectors: [
    injected(), // MetaMask, Rabby, etc
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
});