'use client';

import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { ballotContract } from '@/contracts/ballot.contract';
import { bytesToString } from '@/utils/bytesToString';
import { DataType, EventLog } from '@/contexts/data-provider';
import { useState } from 'react';

export function useData(): DataType {
  const { isConnected, address } = useAccount();
  const [eventLogs, setEventLogs] = useState<EventLog[] | undefined>(undefined);

  useWatchContractEvent({
    ...ballotContract,
    fromBlock: ballotContract.fromBlock, // Query optimization.
    onLogs: (logs) => setEventLogs(logs as EventLog[]),
    poll: true,
    pollingInterval: 3000, // Polygon zkEVM block time.
  });

  const { data: owner } = useReadContract({
    ...ballotContract,
    account: address,
    functionName: 'chairperson',
  });

  const { data: account, refetch: refetchAccount } = useReadContract({
    ...ballotContract,
    account: address,
    functionName: 'voters',
    args: [address!],
  });

  const { data: chairPerson } = useReadContract({
    ...ballotContract,
    account: address,
    functionName: 'chairperson',
  });

  const { data: winnerName, refetch: refetchWinnerName } = useReadContract({
    ...ballotContract,
    account: address,
    functionName: 'winnerName',
  });

  const { data: winningProposal, refetch: refetchWinningProposal } =
    useReadContract({
      ...ballotContract,
      account: address,
      functionName: 'winningProposal',
    });

  const [proposals, setProposals] = useState<
    { name: string; voteCount: number }[]
  >([]);
  const {
    data: proposal,
    refetch: refetchProposal,
    isLoading: isProposalsLoading,
  } = useReadContract({
    ...ballotContract,
    account: address, // Mandatory for "onlyVoters" modifier.
    functionName: 'proposals',
    args: [BigInt(proposals.length)],
    query: {
      gcTime: 0, // Mandatory to avoid cache on loops.
    },
  });

  if (proposal) {
    setProposals([
      ...proposals,
      {
        name: bytesToString(proposal[0]),
        voteCount: Number(proposal[1]),
      },
    ]);
    refetchProposal(); // Loop over proposals.
  }

  function resetProposals() {
    setProposals([]);
    refetchProposal();
  }

  const eventLogsCount = eventLogs?.length;
  const proposalsCount = proposals?.length;
  const votesCount = proposals?.reduce(
    (total, proposal) => total + proposal.voteCount,
    0,
  );

  return {
    data: {
      account: account
        ? {
            weight: Number(account[0]),
            voted: account[1],
            delegate: String(account?.[2]),
            vote: Number(account[3]),
          }
        : undefined,
      chairPerson,
      eventLogs: eventLogs,
      eventLogsCount,
      owner,
      proposals,
      proposalsCount,
      votesCount,
      walletAddress: address,
      winnerName: winnerName ? bytesToString(winnerName) : undefined,
      winningProposal:
        winningProposal !== undefined ? Number(winningProposal) : undefined,
    },
    isConnected: isConnected,
    isProposalsLoading,
    refetchAccount,
    refetchProposals: resetProposals,
    refetchWinnerName,
    refetchWinningProposal,
  };
}
