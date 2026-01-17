/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, Loader2 } from "lucide-react";
import { NetworkHyperEvm } from "@web3icons/react";
import { useChains } from "@/hooks/useChains";
import { useTokens } from "@/hooks/useTokens";
import { useQuote } from "@/hooks/useQuote";
import { LiFiStep } from "@lifi/sdk";

interface ConfigureStepProps {
  walletAddress: string;
  onQuoteReady: (quote: LiFiStep) => void;
}

export function ConfigureStep({
  walletAddress,
  onQuoteReady,
}: ConfigureStepProps) {
  const [sourceChain, setSourceChain] = useState<string>("");
  const [sourceToken, setSourceToken] = useState<string>("");
  const [destinationToken, setDestinationToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [autoDeposit, setAutoDeposit] = useState(false);

  const { chains, isLoading: chainsLoading } = useChains();
  const { tokens: sourceTokens, isLoading: sourceTokensLoading } = useTokens(
    sourceChain,
    {
      includeBalances: true,
      walletAddress,
    }
  );
  const { tokens: destinationTokens, isLoading: destinationTokensLoading } =
    useTokens("999");
  const { fetchQuote } = useQuote();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetQuote = async () => {
    if (!sourceChain || !sourceToken || !destinationToken || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const selectedToken = sourceTokens?.find((t) => t.address === sourceToken);
    if (!selectedToken) return;

    const fromAmount = (
      parseFloat(amount) * Math.pow(10, selectedToken.decimals)
    ).toString();

    setIsLoading(true);
    try {
      const quote = await fetchQuote({
        fromChain: parseInt(sourceChain),
        fromToken: sourceToken,
        fromAmount,
        fromAddress: walletAddress,
        toChain: 999,
        toToken: destinationToken,
      });
      onQuoteReady(quote);
    } catch (error) {
      console.error("Failed to get quote:", error);
      alert("Failed to get quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isUSDCOrHYPE =
    destinationToken &&
    (destinationToken.toLowerCase().includes("usdc") ||
      destinationToken.toLowerCase().includes("hype"));

  return (
    <div className="space-y-6">
      {/* Source Chain Section */}
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex flex-row justify-between gap-4 p-2">
          <div className="space-y-2 flex-1">
            <Label htmlFor="source-chain">From Chain</Label>
            <Select
              value={sourceChain}
              onValueChange={setSourceChain}
              disabled={chainsLoading}
            >
              <SelectTrigger id="source-chain" className="w-full">
                <SelectValue
                  placeholder={chainsLoading ? "Loading..." : "Select chain"}
                />
              </SelectTrigger>
              <SelectContent>
                {chains?.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id.toString()}>
                    <div className="flex items-center gap-2">
                      {chain.logoURI && (
                        <img
                          src={chain.logoURI}
                          alt={chain.name}
                          className="w-5 h-5 rounded-full"
                        />
                      )}
                      <span>{chain.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="source-token">Token</Label>
            <Select
              value={sourceToken}
              onValueChange={setSourceToken}
              disabled={!sourceChain || sourceTokensLoading}
            >
              <SelectTrigger id="source-token" className="w-full">
                <SelectValue
                  placeholder={
                    !sourceChain ? "Select chain first" : "Select token"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {sourceTokens?.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className="flex items-center gap-2">
                      {token.logoURI && (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-5 h-5 rounded-full"
                        />
                      )}
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 p-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="amount">Amount</Label>
            {sourceToken &&
              sourceTokens &&
              (() => {
                const selectedToken = sourceTokens.find(
                  (t) => t.address === sourceToken
                );
                if (selectedToken?.amount) {
                  const balance =
                    Number(selectedToken.amount) /
                    Math.pow(10, selectedToken.decimals);
                  return (
                    <span className="text-xs text-muted-foreground">
                      {balance.toFixed(4)} {selectedToken.symbol}
                    </span>
                  );
                }
                return null;
              })()}
          </div>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-16"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 text-xs"
              onClick={() => {
                const selectedToken = sourceTokens?.find(
                  (t) => t.address === sourceToken
                );
                if (selectedToken?.amount) {
                  const balance =
                    Number(selectedToken.amount) /
                    Math.pow(10, selectedToken.decimals);
                  setAmount(balance.toString());
                }
              }}
            >
              MAX
            </Button>
          </div>
        </div>
      </div>

      {/* Arrow Separator */}
      <div className="flex justify-center">
        <div className="rounded-full bg-muted p-2">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* Destination Section */}
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="space-y-2">
          <Label>To Chain</Label>
          <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
            <NetworkHyperEvm />
            <span className="font-medium">HyperEVM</span>
            <span className="text-xs text-muted-foreground ml-auto">
              Chain ID: 999
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination-token">Receive Token</Label>
          <Select
            value={destinationToken}
            onValueChange={setDestinationToken}
            disabled={destinationTokensLoading}
          >
            <SelectTrigger id="destination-token" className="w-full">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {destinationTokens?.map((token) => (
                <SelectItem key={token.address} value={token.address}>
                  <div className="flex items-center gap-2">
                    {token.logoURI && (
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    <span>{token.symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isUSDCOrHYPE && (
          <div className="flex items-center gap-2 p-3 border rounded-md bg-primary/5">
            <input
              type="checkbox"
              id="auto-deposit"
              className="rounded"
              checked={autoDeposit}
              onChange={(e) => setAutoDeposit(e.target.checked)}
            />
            <Label
              htmlFor="auto-deposit"
              className="text-sm font-normal cursor-pointer"
            >
              Auto-deposit to Hyperliquid trading account
            </Label>
          </div>
        )}
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleGetQuote}
        disabled={
          isLoading ||
          !sourceChain ||
          !sourceToken ||
          !destinationToken ||
          !amount
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting Quote...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </div>
  );
}
