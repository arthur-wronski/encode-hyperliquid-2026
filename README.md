# Slyck - the simplest way to HyperLiquid

A seamless, one-click bridge component for onboarding users to Hyperliquid's HyperEVM from any blockchain.

## Overview

This project provides a production-ready, reusable React component that enables users to bridge tokens from any supported chain to HyperEVM using LI.FI's cross-chain routing infrastructure.

## Key Features

### Core Functionality
- **Multi-chain support**: Bridge from 50+ EVM and Solana chains to HyperEVM
- **Smart token selection**: Automatically displays only tokens with non-zero balances
- **Optimal routing**: LI.FI SDK finds the best rates across all DEXs and bridges
- **Real-time status tracking**: Live updates for each transaction step with block explorer links
- **Error handling**: Automatic retry logic and clear error messages for failed transactions

### UX Highlights
- **4-step guided flow**: Connect wallet → Configure bridge → Review quote → Execute
- **Mobile-first design**: Fully responsive interface optimized for mobile devices
- **Visual progress indicators**: Clear stepper shows current position in the flow
- **Transaction transparency**: Displays gas costs, bridge fees, estimated time, and minimum received amount

### Developer Experience
- **Reusable component**: Drop-in integration with customizable props
- **TypeScript support**: Full type safety throughout
- **Minimal dependencies**: Built with Next.js, shadcn/ui, and Tailwind CSS
- **Configurable**: Supports custom callbacks, default values, and styling

## How It Works

### Step 1: Connect Wallet

Users connect their Web3 wallet (MetaMask, Rabby, WalletConnect, etc.) using RainbowKit integration.

<img width="509" height="482" alt="Screenshot 2026-01-17 at 22 52 35" src="https://github.com/user-attachments/assets/b669add6-f917-4ba2-a7fb-3867abbe7a0c" />

### Step 2: Configure Bridge

Users select:
- Source chain (Ethereum, BSC, Arbitrum, etc.)
- Token to bridge (only shows tokens with balance > 0)
- Amount to bridge (with MAX button for convenience)
- Destination token on HyperEVM

The component automatically fetches token balances and displays them inline for easy reference.

<img width="515" height="677" alt="Screenshot 2026-01-17 at 22 53 10" src="https://github.com/user-attachments/assets/4191de89-b11f-4707-9f7b-612d93bd0e48" />

### Step 3: Review Quote

Before execution, users review:
- Exact amounts (from/to)
- Complete route breakdown (swaps, bridges used)
- Total costs (gas + bridge fees)
- Estimated completion time
- Minimum guaranteed amount (slippage protection)

<img width="514" height="869" alt="Screenshot 2026-01-17 at 22 53 27" src="https://github.com/user-attachments/assets/c3196db8-dcd6-4cd9-9acf-59a458ee5513" />

### Step 4: Execute Bridge

The component executes the bridge transaction with:
- Real-time progress for each step (approval, swap, bridge)
- Transaction hash links to block explorers
- Status updates (pending, active, completed)
- Automatic error recovery with retry options

<img width="523" height="548" alt="Screenshot 2026-01-17 at 22 52 15" src="https://github.com/user-attachments/assets/1cfadc01-415a-42aa-b5b3-b0bfff325788" />

### Setup

```bash
# Clone repository
git clone https://github.com/arthur-wronski/encode-hyperliquid-2026

# Install dependencies
npm install

# Run development server
npm run dev
```

## License

MIT

## Acknowledgments

Built with LI.FI SDK for the Encode Hyperliquid Hackathon 2026.
