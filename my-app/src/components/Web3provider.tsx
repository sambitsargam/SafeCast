'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { ReactNode } from 'react';

interface Web3ProviderProps {
  children: ReactNode;
  appName?: string;
  projectId?: string;
  chains?: any[];
  ssr?: boolean;
}

const defaultChains = [mainnet, polygon, optimism, arbitrum, base];

export default function Web3Provider({ 
  children, 
  appName = 'SafeCast',
  projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains = defaultChains,
  ssr = true 
}: Web3ProviderProps) {
  const config = getDefaultConfig({
    appName,
    projectId,
    chains,
    ssr,
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
