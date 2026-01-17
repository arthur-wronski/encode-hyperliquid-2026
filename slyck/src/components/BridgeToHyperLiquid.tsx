'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ConnectStep } from './steps/ConnectStep';
import { ConfigureStep } from './steps/ConfigureStep';
import { ReviewStep } from './steps/ReviewStep';
import { ExecuteStep } from './steps/ExecuteStep';
import { LiFiStep } from '@lifi/sdk';

type BridgeStep = 'connect' | 'configure' | 'review' | 'execute';

export function BridgeToHyperliquid() {
  const { address, isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState<BridgeStep>('connect');
  const [quote, setQuote] = useState<LiFiStep | null>(null);

  useEffect(() => {
    if (isConnected && currentStep === 'connect') {
      setCurrentStep('configure');
    } else if (!isConnected && currentStep !== 'connect') {
      setCurrentStep('connect');
    }
  }, [isConnected]);

  const steps = ['Connect', 'Configure', 'Review', 'Execute'];
  const stepIndex = ['connect', 'configure', 'review', 'execute'].indexOf(currentStep);

  return (
    <Card className="w-full max-w-lg mx-auto">
      {/* Step Indicator */}
      <CardHeader>
        <div className="flex justify-between mb-4">
          {steps.map((label, idx) => (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-2 text-sm font-medium
                  ${idx <= stepIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {idx + 1}
              </div>
              <span className={`text-xs ${idx <= stepIndex ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {currentStep === 'connect' && <ConnectStep />}
        
        {currentStep === 'configure' && isConnected && (
          <ConfigureStep
            walletAddress={address!}
            onQuoteReady={(q) => {
              setQuote(q);
              setCurrentStep('review');
            }}
          />
        )}
        
        {currentStep === 'review' && quote && (
          <ReviewStep
            quote={quote}
            onBack={() => setCurrentStep('configure')}
            onConfirm={() => setCurrentStep('execute')}
          />
        )}

        {currentStep === 'execute' && quote && (
          <ExecuteStep
            quote={quote}
            onSuccess={() => {
              console.log('Bridge completed successfully!');
              // Optionally reset to start
              // setCurrentStep('configure');
            }}
            onError={(error) => {
              console.error('Bridge failed:', error);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}