'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataContext } from '@/contexts/data-provider';
import { ballotContract } from '@/contracts/ballot.contract';
import { useContract } from '@/hooks/useContract';
import { LoaderCircle } from 'lucide-react';
import { useContext, useState } from 'react';

export function GiveRightToVoteCard() {
  const [giveRightAddress, setGiveRightAddress] = useState<string>('');
  const {
    data: { owner, walletAddress },
    refetchAccount,
  } = useContext(DataContext);
  const { isConnected, isPending, writeContract } = useContract(() => {
    setGiveRightAddress('');
    refetchAccount();
  });

  function submitGiveRights(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeContract({
      ...ballotContract,
      functionName: 'giveRightToVote',
      args: [giveRightAddress as `0x${string}`],
    });
  }

  if (!owner || !walletAddress || owner !== walletAddress) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle>Give right to vote</CardTitle>
        <CardDescription>
          As an admin, you can give the right to vote to another address.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="flex-row gap-6" onSubmit={submitGiveRights}>
          <div className="grid gap-3">
            <Label htmlFor="give_right_address">Address</Label>
            <div className="flex gap-2">
              <Input
                className="w-full"
                disabled={isPending || !isConnected}
                id="give_right_address"
                maxLength={42}
                minLength={42}
                onChange={(event) =>
                  setGiveRightAddress(event.currentTarget.value)
                }
                placeholder="0x..."
                required={true}
                type="text"
                value={giveRightAddress}
              />
              <Button
                className="min-w-32"
                disabled={isPending || !isConnected}
                type="submit"
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>Give rights</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
