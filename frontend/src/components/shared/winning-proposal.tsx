'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataContext } from '@/contexts/data-provider';
import { Trophy } from 'lucide-react';
import { useContext } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function WinningProposal() {
  const {
    data: { winnerName },
  } = useContext(DataContext);

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
          Winning proposal
        </CardTitle>
        <CardDescription>
          The proposal that is currently having the most votes.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-3">
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <Trophy className="h-5 w-5 mr-2" />
                Proposal
              </dt>
              <dd>
                {!winnerName ? (
                  <Skeleton className="h-6 w-48 rounded-full" />
                ) : (
                  winnerName
                )}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
