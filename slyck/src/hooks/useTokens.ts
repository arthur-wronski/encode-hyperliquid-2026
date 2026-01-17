'use client';

import { useState, useEffect } from 'react';
import { getTokens, getTokenBalances } from '@/lib/lifi/sdk';
import { ChainId, TokenAmount } from '@lifi/sdk';

interface UseTokensOptions {
  includeBalances?: boolean;
  walletAddress?: string;
}

export function useTokens(
  chainId: string | number | undefined,
  options: UseTokensOptions = {}
) {
  const [tokens, setTokens] = useState<TokenAmount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { includeBalances = false, walletAddress } = options;

  useEffect(() => {
    if (!chainId) {
      setTokens([]);
      return;
    }

    async function fetchTokens() {
      try {
        setIsLoading(true);
        const numericChainId = typeof chainId === 'string' ? parseInt(chainId) : chainId as ChainId;
        
        const tokensData = await getTokens({
          chains: [numericChainId],
        });

        let chainTokens = tokensData.tokens[numericChainId] || [];
        
        // Filter out tokens without images
        chainTokens = chainTokens.filter(token => token.logoURI);

        if (includeBalances && walletAddress) {
          const tokenBalances = await getTokenBalances(walletAddress, chainTokens);
          const nonZeroBalances = tokenBalances.filter(balance => balance.amount && balance.amount > 0);
          setTokens(nonZeroBalances);
        } else {
          setTokens(chainTokens);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError(err as Error);
        setTokens([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokens();
  }, [chainId, includeBalances, walletAddress]);

  return { tokens, isLoading, error };
}