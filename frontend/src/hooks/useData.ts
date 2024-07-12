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

  const { data: totalSecurityFund } = useReadContract({
    ...tco2Contract,
    args: [securityFund ?? '0x'],
    chainId,
    functionName: 'totalBalanceOf',
    query: {
      enabled: !!securityFund,
      select: (totalSecurityFund: bigint) => (totalSecurityFund != null ? Number(totalSecurityFund) : undefined),
    },
  });

  const { data: totalSupply } = useReadContract({
    ...tco2Contract,
    chainId,
    functionName: 'totalSupply',
    query: {
      refetchInterval: 20_000,
      select: (totalSupply: bigint) => (totalSupply != null ? Number(totalSupply) : undefined),
    },
  });

  const { data: totalBurnSupply } = useReadContract({
    ...tco2Contract,
    chainId,
    functionName: 'totalBurnSupply',
    query: {
      refetchInterval: 20_000,
      select: (totalBurnSupply: bigint) => (totalBurnSupply != null ? Number(totalBurnSupply) : undefined),
    },
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

  function fetchUserData() {
    refetchAccountTotalBalance();
    refetchAccountTotalBurnBalance();
  }

  const { data: accountTotalBalance, refetch: refetchAccountTotalBalance } = useReadContract({
    ...tco2Contract,
    args: [accountAddress ?? '0x'],
    chainId,
    functionName: 'totalBalanceOf',
    query: {
      enabled: !!accountAddress,
      refetchInterval: 20_000,
      select: (totalBalanceOf: bigint) => (totalBalanceOf != null ? Number(totalBalanceOf) : undefined),
    },
  });

  const { data: accountTotalBurnBalance, refetch: refetchAccountTotalBurnBalance } = useReadContract({
    ...tco2Contract,
    args: [accountAddress ?? '0x'],
    chainId,
    functionName: 'totalBurnBalanceOf',
    query: {
      enabled: !!accountAddress,
      refetchInterval: 20_000,
      select: (totalBurnBalanceOf: bigint) => (totalBurnBalanceOf != null ? Number(totalBurnBalanceOf) : undefined),
    },
  });

  const { data: projectTotalSupply, refetch: refetchProjectTotalSupply } = useReadContract({
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

  const { data: projectTotalBurnSupply, refetch: refetchProjectTotalBurnSupply } = useReadContract({
    ...tco2Contract,
    args: [BigInt(projectIdToFetch ?? 0)],
    chainId,
    functionName: 'totalBurnSupply',
    query: {
      enabled: projectIdToFetch != null,
      refetchInterval: 10_000,
      select: (totalBurnSupply: bigint) => (totalBurnSupply != null ? Number(totalBurnSupply) : undefined),
    },
  });

  function fetchAllProjectData(projectId: number) {
    setProjectIdToFetch(projectId);
    refetchProjectTotalBurnSupply();
    refetchProjectTotalSupply();
    refetchProject();
  }

  const { data: projectResult, refetch: refetchProject } = useReadContract({
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
    refetchProjectsBatch();
  }

  const PROJECTS_PAGE_SIZE = 10;
  const {
    data: projectsBatch,
    refetch: refetchProjectsBatch,
    isLoading: projectsBatchIsLoading,
  } = useReadContracts({
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
      isOwner: accountAddress === projectManagerOwner && accountAddress != null,
      totalBalance: accountTotalBalance,
      totalBurnBalance: accountTotalBurnBalance,
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
      projectTotalBurnSupply,
      projectTotalSupply,
      securityFund,
      tco2EventLogs,
      totalBurnSupply,
      totalProjects,
      totalSecurityFund,
      totalSupply,
    },
    queries: {
      projectsBatchIsLoading,
    },
    fetchAllProjectData,
    fetchUserData,
    fetchProjectsPage,
    refetchTotalProjects,
  };
}
