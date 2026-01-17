'use client';

import { Button } from '@/components/ui/button';
import { LiFiStep } from '@lifi/sdk';
import { ArrowRight, ArrowLeft, Clock, DollarSign, Zap, CheckCircle } from 'lucide-react';

interface ReviewStepProps {
  quote: LiFiStep;
  onBack: () => void;
  onConfirm: () => void;
}

export function ReviewStep({ quote, onBack, onConfirm }: ReviewStepProps) {
  const fromAmount = Number(quote.action.fromAmount) / Math.pow(10, quote.action.fromToken.decimals);
  const toAmount = quote.estimate ? Number(quote.estimate.toAmount) / Math.pow(10, quote.action.toToken.decimals) : 0;
  const toAmountMin = quote.estimate ? Number(quote.estimate.toAmountMin) / Math.pow(10, quote.action.toToken.decimals) : 0;
  
  const executionTime = quote.estimate ? Math.ceil(quote.estimate.executionDuration / 60) : 0;
  const gasCostUSD = quote.estimate?.gasCosts?.reduce((acc, gas) => acc + parseFloat(gas.amountUSD || '0'), 0) || 0;
  const feeCostUSD = quote.estimate?.feeCosts?.reduce((acc, fee) => acc + parseFloat(fee.amountUSD || '0'), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Review Your Bridge</h3>
        <p className="text-sm text-muted-foreground">
          Please review the details before confirming
        </p>
      </div>

      {/* From/To Display */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          {quote.action.fromToken.logoURI && (
            <img
              src={quote.action.fromToken.logoURI}
              alt={quote.action.fromToken.symbol}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-lg">{fromAmount.toFixed(4)}</p>
            <p className="text-xs text-muted-foreground">{quote.action.fromToken.symbol}</p>
          </div>
        </div>

        <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />

        <div className="flex items-center gap-3">
          {quote.action.toToken.logoURI && (
            <img
              src={quote.action.toToken.logoURI}
              alt={quote.action.toToken.symbol}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-lg">{toAmount.toFixed(4)}</p>
            <p className="text-xs text-muted-foreground">{quote.action.toToken.symbol}</p>
          </div>
        </div>
      </div>

      {/* Route Steps */}
      {quote.includedSteps && quote.includedSteps.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Route</p>
          <div className="space-y-2">
            {quote.includedSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">{index + 1}</span>
                </div>
                <img
                  src={step.toolDetails.logoURI}
                  alt={step.toolDetails.name}
                  className="w-5 h-5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{step.toolDetails.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{step.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
          <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Estimated Time</p>
            <p className="font-medium">{executionTime} min</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
          <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Gas Cost</p>
            <p className="font-medium">${gasCostUSD.toFixed(2)}</p>
          </div>
        </div>

        {feeCostUSD > 0 && (
          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg col-span-2">
            <Zap className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Bridge Fees</p>
              <p className="font-medium">${feeCostUSD.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Minimum Received */}
      <div className="p-4 border rounded-lg bg-background">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Minimum Received</span>
          <span className="font-semibold">
            {toAmountMin.toFixed(4)} {quote.action.toToken.symbol}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onConfirm} className="flex-1">
          <CheckCircle className="w-4 h-4 mr-2" />
          Confirm Bridge
        </Button>
      </div>
    </div>
  );
}