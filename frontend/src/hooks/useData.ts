'use client';

import { useAccount, useConfig, useReadContract, useWatchContractEvent } from 'wagmi';
import { DataType, EventLog } from '@/contexts/data-provider';
import { tco2 } from '@/contracts/tco2.contract';
import { projectManager } from '@/contracts/projectManager.contract';
import { useEffect, useState } from 'react';
import { baseSepolia } from 'viem/chains';

export function useData(): DataType {
  const [eventLogs, setEventLogs] = useState<EventLog[] | undefined>(undefined);
  const [tco2EventLogs, setTco2EventLogs] = useState<EventLog[] | undefined>(undefined);

  const wagmiConfig = useConfig();
  const { isConnected, address: accountAddress, chainId: accountChainId = baseSepolia.id } = useAccount();

  const chainId = wagmiConfig.chains.map((chain) => chain.id).includes(accountChainId)
    ? accountChainId
    : baseSepolia.id;

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
    eventName: 'logs' as any, // Hack eventName because typescript is incorrect.
    onLogs: (logs) => setEventLogs(logs.reverse() as EventLog[]),
    enabled: !!chainId,
    syncConnectedChain: true,
  });

  useWatchContractEvent({
    ...tco2Contract,
    chainId: chainId,
    eventName: 'logs' as any, // Hack eventName because typescript is incorrect.
    onLogs: (logs) => setTco2EventLogs(logs.reverse() as EventLog[]),
    enabled: !!chainId,
    syncConnectedChain: true,
  });

  const { data: projectManagerOwner, refetch: refetchProjectManagerOwner } = useReadContract({
    ...projectManagerContract,
    chainId: chainId,
    functionName: 'owner',
  });

  const { data: securityFund, refetch: refetchSecurityFund } = useReadContract({
    ...projectManagerContract,
    chainId: chainId,
    functionName: 'securityFund',
  });

  const { data: totalProjects, refetch: refetchTotalProjects } = useReadContract({
    ...projectManagerContract,
    chainId: chainId,
    functionName: 'totalProjects',
    query: {
      refetchInterval: 10_000,
    },
  });

  return {
    account: {
      address: accountAddress,
      isConnected,
    },
    chainId,
    data: {
      eventLogs,
      projectManagerOwner,
      securityFund,
      tco2EventLogs,
      totalProjects: totalProjects != null ? Number(totalProjects) : undefined,
    },
    refetchProjectManagerOwner,
    refetchSecurityFund,
    refetchTotalProjects,
  };
}
