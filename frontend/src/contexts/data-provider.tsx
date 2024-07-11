'use client';

import { useData } from '@/hooks/useData';
import { createContext } from 'react';
import { Log } from 'viem';
import { ReactNode } from 'react';
import { Project } from '@/types/Project';

export type EventLog = Log & {
  args: Record<string, unknown>;
  eventName: string;
};

export type Contract = {
  abi: readonly any[];
  address: `0x${string}`;
  fromBlock: bigint;
};

export interface DataType {
  account: {
    address: `0x${string}` | undefined;
    isConnected: boolean;
  };
  chainId: number | undefined;
  contracts: {
    projectManagerContract: Contract | undefined;
    tco2Contract: Contract | undefined;
  };
  data: {
    eventLogs: EventLog[] | undefined;
    projectManagerOwner: `0x${string}` | undefined;
    projects: (Project | undefined)[];
    projectTotalBurnSupply: number | undefined;
    projectTotalSupply: number | undefined;
    securityFund: `0x${string}` | undefined;
    tco2EventLogs: EventLog[] | undefined;
    totalBurnSupply: number | undefined;
    totalProjects: number | undefined;
    totalSecurityFund: number | undefined;
    totalSupply: number | undefined;
  };
  fetchAllProjectData: (projectId: number) => void;
  fetchProjectsPage: (page: number) => void;
  refetchTotalProjects: () => void;
}

export const DataContext = createContext<DataType>({
  account: {
    address: undefined,
    isConnected: false,
  },
  chainId: undefined,
  contracts: {
    projectManagerContract: undefined,
    tco2Contract: undefined,
  },
  data: {
    eventLogs: undefined,
    projectManagerOwner: undefined,
    projects: [],
    projectTotalBurnSupply: undefined,
    projectTotalSupply: undefined,
    securityFund: undefined,
    tco2EventLogs: undefined,
    totalBurnSupply: undefined,
    totalProjects: undefined,
    totalSecurityFund: undefined,
    totalSupply: undefined,
  },
  fetchAllProjectData: () => undefined,
  fetchProjectsPage: () => undefined,
  refetchTotalProjects: () => undefined,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const data = useData();
  console.log(data); // TODO: remove debug
  return <DataContext.Provider value={{ ...data }}>{children}</DataContext.Provider>;
}
