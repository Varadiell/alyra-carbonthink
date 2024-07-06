'use client';

import { useAccount, useWatchContractEvent } from 'wagmi';
import { DataType, EventLog } from '@/contexts/data-provider';
import { projectManagerContract } from '@/contracts/projectManager.contract';
import { useState } from 'react';

export function useData(): DataType {
  const [eventLogs, setEventLogs] = useState<EventLog[] | undefined>(undefined);

  const { isConnected, address } = useAccount();

  useWatchContractEvent({
    ...projectManagerContract,
    onLogs: (logs) => setEventLogs(logs.reverse() as EventLog[]),
  });

  return {
    account: {
      address,
      isConnected,
    },
    data: {
      eventLogs,
      // TODO: data
    },
  };
}
