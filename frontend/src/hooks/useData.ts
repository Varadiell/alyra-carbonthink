'use client';

import { useAccount, useConfig, useReadContract, useReadContracts, useWatchContractEvent } from 'wagmi';
import { DataType, EventLog } from '@/contexts/data-provider';
import { tco2 } from '@/contracts/tco2.contract';
import { projectManager } from '@/contracts/projectManager.contract';
import { useEffect, useState } from 'react';
import { baseSepolia } from 'viem/chains';
import { Project, ProjectRaw } from '@/types/Project';
import { toProject } from '@/utils/adapters';

export function useData(): DataType {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsPage, setProjectsPage] = useState<number | undefined>(undefined);
  const [projectIdToFetch, setProjectIdToFetch] = useState<number | undefined>(undefined);
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

  function fetchProjectId(projectId: number) {
    setProjectIdToFetch(projectId);
    refetchProject();
  }

  const { data: projectResult, refetch: refetchProject } = useReadContract({
    ...projectManagerContract,
    args: [BigInt(projectIdToFetch ?? 0)],
    chainId,
    functionName: 'get',
    query: {
      enabled: projectIdToFetch != null,
    },
  });

  useEffect(() => {
    const newProjects = [...projects];
    if (projectResult) {
      const project = toProject(projectResult as unknown as ProjectRaw);
      newProjects[project.id] = project;
    }
    setProjects(newProjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectResult]);

  function fetchProjectsPage(page: number) {
    setProjectsPage(page);
    refetchProjects();
  }

  const PROJECTS_PAGE_SIZE = 10;
  const { data: projectsBatch, refetch: refetchProjects } = useReadContracts({
    contracts: Array.from({ length: PROJECTS_PAGE_SIZE }).map((_, index) => ({
      ...projectManagerContract,
      args: [BigInt(Number(totalProjects ?? 0) - index - ((projectsPage ?? 1) - 1) * PROJECTS_PAGE_SIZE - 1)],
      chainId,
      functionName: 'get',
    })),
    query: {
      enabled: projectsPage != null,
    },
  });

  useEffect(() => {
    const newProjects = [...projects];
    projectsBatch?.forEach((row) => {
      if (row.result) {
        const project = toProject(row.result as unknown as ProjectRaw);
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
      projects,
      securityFund,
      tco2EventLogs,
      totalProjects: totalProjects != null ? Number(totalProjects) : undefined,
    },
    fetchProjectId,
    fetchProjectsPage,
    refetchProjectManagerOwner,
    refetchSecurityFund,
    refetchTotalProjects,
  };
}
