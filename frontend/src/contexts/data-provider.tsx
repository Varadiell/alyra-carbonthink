'use client';

import { useData } from '@/hooks/useData';
import { createContext } from 'react';
import { Log } from 'viem';
import { ReactNode } from 'react';

export type EventLog = Log & {
  args: Record<string, unknown>;
  eventName: string;
};

export type Project = {
  data: {
    ares: number;
    calculationMethod: string;
    city: string;
    continent: string;
    coordinates: string;
    country: string;
    duration: number;
    expectedCo2Tons: number;
    location: string;
    plantedSpecies: string;
    province: string;
    region: string;
    startDate: number;
    unSDGs: number[];
  };
  description: string;
  documentUrls: string[];
  externalUrl: string;
  id: number;
  image: string;
  isRegistered: boolean;
  name: string;
  photoUtils: string[];
  projectHolder: `0x${string}`;
  status: number;
};

export interface DataType {
  account: {
    address: `0x${string}` | undefined;
    isConnected: boolean;
  };
  chainId: number | undefined;
  data: {
    eventLogs: EventLog[] | undefined;
    projectManagerOwner: `0x${string}` | undefined;
    projects: (Project | undefined)[];
    securityFund: `0x${string}` | undefined;
    tco2EventLogs: EventLog[] | undefined;
    totalProjects: number | undefined;
  };
  refetchProjectManagerOwner: () => void;
  refetchSecurityFund: () => void;
  refetchTotalProjects: () => void;
}

export const DataContext = createContext<DataType>({
  account: {
    address: undefined,
    isConnected: false,
  },
  chainId: undefined,
  data: {
    eventLogs: undefined,
    projectManagerOwner: undefined,
    projects: [],
    securityFund: undefined,
    tco2EventLogs: undefined,
    totalProjects: undefined,
  },
  refetchProjectManagerOwner: () => undefined,
  refetchSecurityFund: () => undefined,
  refetchTotalProjects: () => undefined,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const data = useData();
  console.log(data); // TODO: remove debug
  return <DataContext.Provider value={{ ...data }}>{children}</DataContext.Provider>;
}
