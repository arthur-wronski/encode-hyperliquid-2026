import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';

export function ConnectStep() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Wallet className="w-8 h-8 text-primary" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Connect Your Wallet</h3>
        <p className="text-muted-foreground max-w-sm">
          Connect your wallet to start bridging to Hyperliquid
        </p>
      </div>

      <ConnectButton />

    </div>
  );
}