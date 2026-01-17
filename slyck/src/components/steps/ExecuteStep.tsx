"use client";

import { useEffect, useState } from "react";
import { LiFiStep, ProcessStatus, RouteExtended } from "@lifi/sdk";
import { executeRoute, convertQuoteToRoute } from "@/lib/lifi/sdk";
import { CheckCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExecuteStepProps {
  quote: LiFiStep;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

type StepStatus = ProcessStatus;

interface ProcessStep {
  type: string;
  status: StepStatus;
  txHash?: string;
  txLink?: string;
  message?: string;
}

export function ExecuteStep({ quote, onSuccess, onError }: ExecuteStepProps) {
  const [currentRoute, setCurrentRoute] = useState<RouteExtended | null>(null);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeBridge = async () => {
    setIsExecuting(true);
    setError(null);

    try {
      // Convert quote to route
      const route = convertQuoteToRoute(quote);

      // Execute the route
      await executeRoute(route, {
        updateRouteHook: (updatedRoute) => {
          setCurrentRoute(updatedRoute);

          // Extract step information
          const processSteps: ProcessStep[] = [];

          updatedRoute.steps.forEach((step) => {
            step.execution?.process.forEach((process) => {
              processSteps.push({
                type: `${step.toolDetails.name} - ${process.type}`,
                status: process.status as StepStatus,
                txHash: process.txHash,
                txLink: process.txLink,
                message: process.message,
              });
            });
          });

          setSteps(processSteps);
        },

        acceptExchangeRateUpdateHook: async ({
          toToken,
          oldToAmount,
          newToAmount,
        }) => {
          // Auto-accept small rate changes (<1%)
          const oldNum = parseFloat(oldToAmount);
          const newNum = parseFloat(newToAmount);
          const change = Math.abs((newNum - oldNum) / oldNum);

          if (change < 0.01) return true;

          // For larger changes, show confirmation
          return confirm(
            `Exchange rate changed. New amount: ${(
              newNum / Math.pow(10, toToken.decimals)
            ).toFixed(4)} ${toToken.symbol}. Continue?`
          );
        },
      });

      setIsExecuting(false);
      onSuccess();
    } catch (err) {
      console.error("Bridge execution failed:", err);
      setError((err as Error).message);
      setIsExecuting(false);
      onError(err as Error);
    }
  };

  useEffect(() => {
    executeBridge();
  }, []);

  const getStatusIcon = (status: ProcessStatus) => {
    switch (status) {
      case "DONE":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "ACTION_REQUIRED":
      case "MESSAGE_REQUIRED":
      case "PENDING":
      case "STARTED":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "FAILED":
      case "CANCELLED":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "RESET_REQUIRED":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">
          {isExecuting
            ? "Executing Bridge..."
            : error
            ? "Execution Failed"
            : "Bridge Complete!"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isExecuting
            ? "Please confirm transactions in your wallet"
            : error
            ? "Something went wrong during execution"
            : "Your tokens have been bridged successfully"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`
              flex items-start gap-3 p-4 rounded-lg border
              ${
                step.status === "active"
                  ? "bg-primary/5 border-primary"
                  : "bg-muted/30"
              }
            `}
          >
            <div className="mt-0.5">{getStatusIcon(step.status)}</div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{step.type}</p>
              {step.message && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.message}
                </p>
              )}
              {step.txHash && (
                <a
                  href={step.txLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  View transaction
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}

        {steps.length === 0 && isExecuting && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={executeBridge}
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}
