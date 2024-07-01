'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi.config';
import React from 'react';
import { ConnectKitProvider } from 'connectkit';

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            '--ck-connectbutton-border-radius': '6px',
            '--ck-connectbutton-background': 'hsl(var(--background))',
            '--ck-connectbutton-color': 'hsl(var(--accent-foreground))',
            '--ck-connectbutton-hover-background': 'hsl(var(--accent))',
            '--ck-connectbutton-active-background': 'hsl(var(--background))',
            '--ck-connectbutton-balance-background': 'hsl(var(--muted))',
            '--ck-connectbutton-balance-color': 'hsl(var(--accent-foreground))',
            '--ck-connectbutton-balance-hover-background': 'hsl(var(--muted))',
            '--ck-connectbutton-balance-active-background':
              'hsl(var(--background))',
            '--ck-connectbutton-box-shadow': '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-balance-box-shadow':
              '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-hover-box-shadow':
              '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-balance-hover-box-shadow':
              '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-active-box-shadow':
              '0 0 0 1px hsl(var(--input))',
            '--ck-connectbutton-balance-active-box-shadow':
              '0 0 0 1px hsl(var(--input))',
          }}
          options={{
            language: 'en-US',
          }}
          mode="auto"
          theme="auto"
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
