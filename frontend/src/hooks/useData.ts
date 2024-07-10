'use client';

import { useAccount, useBlockNumber, useConfig, useReadContract, useReadContracts, useWatchContractEvent } from 'wagmi';
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

  const { data: blockNumber } = useBlockNumber({ chainId, query: { refetchInterval: 20_000 } });

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
    enabled: !!chainId && blockNumber != null,
    eventName: 'logs' as any, // Hack eventName because typescript is incorrect.
    fromBlock: BigInt(Math.max(Number(blockNumber ?? 0) - 49_000, 0)), // Depth of 50_000 max on testnet RPC.
    onError() {
      if (eventLogs === undefined) {
        setEventLogs([]);
      }
    },
    onLogs: (logs) => setEventLogs(logs.reverse() as EventLog[]),
    syncConnectedChain: true,
  });

  useWatchContractEvent({
    ...tco2Contract,
    chainId,
    enabled: !!chainId && blockNumber != null,
    eventName: 'logs' as any, // Hack eventName because typescript is incorrect.
    fromBlock: BigInt(Math.max(Number(blockNumber ?? 0) - 49_000, 0)), // Depth of 50_000 max on testnet RPC.
    onError() {
      if (tco2EventLogs === undefined) {
        setTco2EventLogs([]);
      }
    },
    onLogs: (logs) => setTco2EventLogs(logs.reverse() as EventLog[]),
    syncConnectedChain: true,
  });

  const { data: projectManagerOwner } = useReadContract({
    ...projectManagerContract,
    chainId,
    functionName: 'owner',
  });

  const { data: securityFund } = useReadContract({
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
      select: (totalProjects: bigint) => (totalProjects != null ? Number(totalProjects) : undefined),
    },
  });

  const { data: projectTotalSupply } = useReadContract({
    ...tco2Contract,
    args: [BigInt(projectIdToFetch ?? 0)],
    chainId,
    functionName: 'totalSupply',
    query: {
      enabled: projectIdToFetch != null,
      refetchInterval: 10_000,
      select: (totalSupply: bigint) => (totalSupply != null ? Number(totalSupply) : undefined),
    },
  });

  function fetchAllProjectData(projectId: number) {
    setProjectIdToFetch(projectId);
  }

  const { data: projectResult } = useReadContract({
    ...projectManagerContract,
    args: [BigInt(projectIdToFetch ?? 0)],
    chainId,
    functionName: 'get',
    query: {
      enabled: projectIdToFetch != null,
      // TODO: select transform data here
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
      // TODO: select transform data here
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
    contracts: {
      projectManagerContract,
      tco2Contract,
    },
    data: {
      eventLogs,
      projectManagerOwner,
      projects,
      projectTotalSupply,
      securityFund,
      tco2EventLogs,
      totalProjects,
    },
    fetchAllProjectData,
    fetchProjectsPage,
    refetchTotalProjects,
  };
}
