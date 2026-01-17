'use client';

import { useState, useEffect } from 'react';
import { getChains, ChainType, Chain } from '@lifi/sdk';

export function useChains() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchChains() {
      try {
        setIsLoading(true);
        const chainsData = await getChains({ 
          chainTypes: [ChainType.EVM, ChainType.SVM] 
        });
        
        // Filter to only mainnet chains for production
        const mainnetChains = chainsData.filter((chain) => chain.mainnet);
        
        setChains(mainnetChains as Chain[]);
        setError(null);
      } catch (err) {
        console.error('Error fetching chains:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChains();
  }, []);

  return { chains, isLoading, error };
}