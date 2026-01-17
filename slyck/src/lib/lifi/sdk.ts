import { ChainId, createConfig, EVM } from '@lifi/sdk';
import { getWalletClient, switchChain } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi/config';

createConfig({
  integrator: 'slyck',
  providers: [
    EVM({
      getWalletClient: () => getWalletClient(wagmiConfig),
      switchChain: async (chainId: ChainId) => {
        const chain = await switchChain(wagmiConfig, { chainId });
        return getWalletClient(wagmiConfig, { chainId: chain.id });
      },
    }),
  ],
});

export { getChains, getTokens, getTokenBalances, getQuote, executeRoute, convertQuoteToRoute } from '@lifi/sdk';