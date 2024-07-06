'use client';

import { useData } from '@/hooks/useData';
import { createContext } from 'react';
import { Log } from 'viem';
import { ReactNode } from 'react';

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
    eventLogs: EventLog[] | undefined;
  };
}

export const DataContext = createContext<DataType>({
  account: {
    address: undefined,
    isConnected: false,
  },
  data: {
    eventLogs: undefined,
  },
});

export function DataProvider({ children }: { children: ReactNode }) {
  const data = useData();
  console.log(data); // TODO: remove debug
  return <DataContext.Provider value={{ ...data }}>{children}</DataContext.Provider>;
}
