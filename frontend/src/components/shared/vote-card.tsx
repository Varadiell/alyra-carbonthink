'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataContext } from '@/contexts/data-provider';
import { ballotContract } from '@/contracts/ballot.contract';
import { useContract } from '@/hooks/useContract';
import { LoaderCircle } from 'lucide-react';
import { useContext, useState } from 'react';

export function VoteCard() {
  const {
    data,
    refetchAccount,
    refetchProposals,
    refetchWinnerName,
    refetchWinningProposal,
  } = useContext(DataContext);
  const [proposalId, setProposalId] = useState<string | undefined>(undefined);
  const { isConnected, isPending, writeContract } = useContract(() => {
    setProposalId('');
    refetchAccount();
    refetchWinnerName();
    refetchWinningProposal();
    refetchProposals();
  });

  function submitVote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeContract({
      ...ballotContract,
      functionName: 'vote',
      args: [BigInt(Number(proposalId))],
    });
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle>Vote</CardTitle>
        <CardDescription>
          As a registered voter, you can vote for a proposal.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="flex-row gap-6" onSubmit={submitVote}>
          <div className="grid gap-3">
            <Label htmlFor="vote_proposal">Proposal</Label>
            <div className="flex gap-2">
              <Select
                required={true}
                value={proposalId}
                onValueChange={(value) => setProposalId(value)}
              >
                <SelectTrigger
                  className="w-full"
                  id="vote_proposal"
                  disabled={isPending || !isConnected}
                >
                  <SelectValue placeholder="Select a proposal..." />
                </SelectTrigger>
                <SelectContent>
                  {data.proposals &&
                    data.proposals.map((proposal, index) => (
                      <SelectItem key={index} value={String(index)}>
                        {proposal.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                className="min-w-32"
                disabled={isPending || !isConnected}
                type="submit"
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>Vote</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
