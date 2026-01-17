'use client';

import { useState } from 'react';
import { getQuote } from '@/lib/lifi/sdk';
import type { LiFiStep } from '@lifi/sdk';

export function useQuote() {
  const [quote, setQuote] = useState<LiFiStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuote = async (params: {
    fromChain: number;
    fromToken: string;
    fromAmount: string;
    fromAddress: string;
    toChain: number;
    toToken: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getQuote(params);
      console.log(result)
      setQuote(result);
      return result;
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { quote, isLoading, error, fetchQuote };
}