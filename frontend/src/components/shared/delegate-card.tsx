'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ballotContract } from '@/contracts/ballot.contract';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContract } from '@/hooks/useContract';
import { useContext, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { DataContext } from '@/contexts/data-provider';

export function DelegateCard() {
  const [delegateAddress, setDelegateAddress] = useState<string>('');
  const { refetchAccount } = useContext(DataContext);
  const { isConnected, isPending, writeContract } = useContract(() => {
    setDelegateAddress('');
    refetchAccount();
  });

  function submitDelegate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeContract({
      ...ballotContract,
      functionName: 'delegate',
      args: [delegateAddress as `0x${string}`],
    });
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle>Delegate</CardTitle>
        <CardDescription>
          As a registered voter, you can delegate your right to vote to another
          address.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="flex-row gap-6" onSubmit={submitDelegate}>
          <div className="grid gap-3">
            <Label htmlFor="delegate_address">Address</Label>
            <div className="flex gap-2">
              <Input
                className="w-full"
                disabled={isPending || !isConnected}
                id="delegate_address"
                maxLength={42}
                minLength={42}
                onChange={(event) =>
                  setDelegateAddress(event.currentTarget.value)
                }
                placeholder="0x..."
                required={true}
                type="text"
                value={delegateAddress}
              />
              <Button
                className="min-w-32"
                disabled={isPending || !isConnected}
                type="submit"
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>Delegate</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
