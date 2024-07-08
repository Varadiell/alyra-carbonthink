'use client';

import { useAccount, useConfig, useReadContract, useReadContracts, useWatchContractEvent } from 'wagmi';
import { DataType, EventLog, Project } from '@/contexts/data-provider';
import { tco2 } from '@/contracts/tco2.contract';
import { projectManager } from '@/contracts/projectManager.contract';
import { useEffect, useState } from 'react';
import { baseSepolia } from 'viem/chains';

export function useData(): DataType {
  const [projects, setProjects] = useState<Project[]>([]);
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
    chainId,
    eventName: 'logs' as any, // Hack eventName because typescript is incorrect.
    onLogs: (logs) => setEventLogs(logs.reverse() as EventLog[]),
    enabled: !!chainId,
    syncConnectedChain: true,
  });

  useWatchContractEvent({
    ...tco2Contract,
    chainId,
    eventName: 'logs' as any, // Hack eventName because typescript is incorrect.
    onLogs: (logs) => setTco2EventLogs(logs.reverse() as EventLog[]),
    enabled: !!chainId,
    syncConnectedChain: true,
  });

  const { data: projectManagerOwner, refetch: refetchProjectManagerOwner } = useReadContract({
    ...projectManagerContract,
    chainId,
    functionName: 'owner',
  });

  const { data: securityFund, refetch: refetchSecurityFund } = useReadContract({
    ...projectManagerContract,
    chainId,
    functionName: 'securityFund',
  });

  const { data: totalProjects, refetch: refetchTotalProjects } = useReadContract({
    ...projectManagerContract,
    chainId,
    functionName: 'totalProjects',
    query: {
      refetchInterval: 10_000,
    },
  });

  const contractCalls = Array.from({ length: Number(10) }).map((_, index) => ({
    ...projectManagerContract,
    args: [BigInt(Math.max(Number(totalProjects ?? 0) - index - 1, 0))],
    chainId,
    functionName: 'get',
  }));

  const { data: projectsBatch } = useReadContracts({
    contracts: contractCalls,
  });

  console.log('projectsBatch', projectsBatch);

  useEffect(() => {
    // TODO: improve
    const newProjects = [...projects];
    projectsBatch?.forEach((p) => {
      const project = p.result as unknown as Project;
      if (project?.id != null) {
        newProjects[project.id] = project;
      }
    });
    setProjects(newProjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsBatch]);

  return {
    account: {
      address: accountAddress,
      isConnected,
    },
    chainId,
    data: {
      eventLogs,
      projectManagerOwner,
      projects, // TODO: adapt projects
      securityFund,
      tco2EventLogs,
      totalProjects: totalProjects != null ? Number(totalProjects) : undefined,
    },
    refetchProjectManagerOwner,
    refetchSecurityFund,
    refetchTotalProjects,
  };
}
