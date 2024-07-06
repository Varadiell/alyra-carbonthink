'use client';

import { DataContext, EventLog } from '@/contexts/data-provider';
import { useContext } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

function parseEvent(eventLog: EventLog) {
  const eventName = eventLog.eventName;
  if (eventName === 'OwnershipTransferred') {
    const args = eventLog.args as { newOwner: string; previousOwner: string };
    return {
      newOwner: args.newOwner,
      previousOwner: args.previousOwner,
    };
  } else if (['DocumentAdded', 'PhotoAdded', 'Created'].includes(eventName)) {
    const args = eventLog.args as { projectId: string };
    return {
      projectId: String(args.projectId),
    };
  } else if (eventName === 'Minted') {
    const args = eventLog.args as { projectId: number; account: string; amount: number };
    return {
      projectId: String(args.projectId),
      account: args.account,
      amount: String(args.amount),
    };
  } else if (eventName === 'StatusChanged') {
    const args = eventLog.args as { projectId: number; status: number };
    return {
      projectId: String(args.projectId),
      status: String(args.status),
    };
  } else {
    return {};
  }
}

export function EventsList() {
  const {
    data: { eventLogs },
  } = useContext(DataContext);

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle>Events</CardTitle>
        <CardDescription>List of events that occurred.</CardDescription>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Block number</TableHead>
            <TableHead>Event name</TableHead>
            <TableHead>Arguments</TableHead>
            <TableHead>Transaction hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!eventLogs
            ? [...new Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-1/2" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-1/2" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-1/2" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-1/2" />
                  </TableCell>
                </TableRow>
              ))
            : eventLogs?.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <a href={`https://basescan.org/block/${Number(event.blockNumber)}`} target="_blank">
                      <Badge variant="secondary">{Number(event.blockNumber)}</Badge>
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge>{event.eventName}</Badge>
                  </TableCell>
                  <TableCell className="flex gap-2 flex-col">
                    {Object.entries(parseEvent(event)).map(([k, v], index) => (
                      <div key={index} className="flex gap-2">
                        {k}
                        <Badge variant="secondary">{v}</Badge>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <a href={`https://basescan.org/tx/${Number(event.transactionHash)}`} target="_blank">
                      <Badge variant="secondary">{event.transactionHash}</Badge>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </Card>
  );
}
