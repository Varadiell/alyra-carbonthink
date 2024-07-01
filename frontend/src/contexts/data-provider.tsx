'use client';

import { useData } from '@/hooks/useData';
import * as React from 'react';
import { createContext } from 'react';
import { Log } from 'viem';

export type EventLog = Log & {
  args: Record<string, unknown>;
  eventName: string;
};

export interface DataType {
  account: {
    address: `0x${string}` | undefined;
    isConnected: boolean;
  };
  data: {
    // TODO: data
  };
}

export const DataContext = createContext<DataType>({
  account: {
    address: undefined,
    isConnected: false,
  },
  data: {
    // TODO: data
  },
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const data = useData();
  console.log(data); // TODO: remove debug
  return <DataContext.Provider value={{ ...data }}>{children}</DataContext.Provider>;
}
