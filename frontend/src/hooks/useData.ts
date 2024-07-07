'use client';

import { useAccount, useWatchContractEvent } from 'wagmi';
import { DataType, EventLog } from '@/contexts/data-provider';
import { projectManagerContract } from '@/contracts/projectManager.contract';
import { useEffect, useState } from 'react';

export function useData(): DataType {
  const [eventLogs, setEventLogs] = useState<EventLog[] | undefined>(undefined);

  const { isConnected, address, chain } = useAccount();

  useEffect(() => {
    // Chain change, reset all data.
    setEventLogs(undefined);
  }, [chain]);

  useEffect(() => {
    // User change, reset user data.
    // TODO: reset user data
  }, [address]);

  useWatchContractEvent({
    ...projectManagerContract,
    chainId: chain?.id,
    onLogs: (logs) => setEventLogs(logs.reverse() as EventLog[]),
    enabled: isConnected,
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
