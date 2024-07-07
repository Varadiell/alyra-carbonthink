'use client';

import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { DataType, EventLog } from '@/contexts/data-provider';
import { tco2 } from '@/contracts/tco2.contract';
import { projectManager } from '@/contracts/projectManager.contract';
import { useEffect, useState } from 'react';
import { config as wagmiConfig } from '@/lib/wagmi.config';

export function useData(): DataType {
  const [eventLogs, setEventLogs] = useState<EventLog[] | undefined>(undefined);
  const [tco2EventLogs, setTco2EventLogs] = useState<EventLog[] | undefined>(undefined);

  const { isConnected, address: accountAddress, chainId = wagmiConfig.chains[0].id } = useAccount();
  const tco2Contract = tco2(chainId);
  const projectManagerContract = projectManager(chainId);

  useEffect(() => {
    // At chain change, reset data.
    setEventLogs(undefined);
    setTco2EventLogs(undefined);
  }, [chainId]);

  useWatchContractEvent({
    ...projectManagerContract,
    chainId: chainId,
    onLogs: (logs) => setEventLogs(logs.reverse() as EventLog[]),
    enabled: !!chainId,
  });

  useWatchContractEvent({
    ...tco2Contract,
    chainId: chainId,
    onLogs: (logs) => setTco2EventLogs(logs.reverse() as EventLog[]),
    enabled: !!chainId,
  });

  const { data: projectManagerOwner, refetch: refetchProjectManagerOwner } = useReadContract({
    ...projectManagerContract,
    chainId: chainId,
    functionName: 'owner',
  });

  const { data: totalProjects, refetch: refetchTotalProjects } = useReadContract({
    ...projectManagerContract,
    chainId: chainId,
    functionName: 'totalProjects',
  });

  return {
    account: {
      address: accountAddress,
      isConnected,
    },
    data: {
      eventLogs,
      projectManagerOwner,
      tco2EventLogs,
      totalProjects: totalProjects != null ? Number(totalProjects) : undefined,
      // TODO: data
    },
    refetchProjectManagerOwner,
    refetchTotalProjects,
  };
}
