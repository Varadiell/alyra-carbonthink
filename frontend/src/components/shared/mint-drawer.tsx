'use client';

import * as React from 'react';
import { Coins, LoaderCircle, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { useContext, useState } from 'react';
import { projectManager } from '@/contracts/projectManager.contract';
import { useContract } from '@/hooks/useContract';
import { DataContext } from '@/contexts/data-provider';
import { projectToMetadataBase64 } from '@/utils/adapters';

export function MintDrawer({ projectId }: { projectId: number }) {
  const [nbTokensToMint, setNbTokensToMint] = useState<number>(100);

  const {
    chainId,
    data: { projects },
    fetchProjectId,
  } = useContext(DataContext);

  const { isConnected, isPending, writeContract } = useContract(() => {
    fetchProjectId(projectId);
  });

  function mint() {
    if (!chainId || !projects[projectId]) {
      return;
    }
    const project = projects[projectId];
    // TODO: no metadata when some tokens were already minted
    writeContract({
      ...projectManager(chainId),
      args: [BigInt(projectId), BigInt(nbTokensToMint), projectToMetadataBase64(project)],
      chainId,
      functionName: 'mintTokens',
    });
  }

  function onClick(adjustment: number) {
    setNbTokensToMint(Math.max(0, Math.min(10000, nbTokensToMint + adjustment)));
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="w-52" disabled={[0, 3].includes(projects[projectId]?.status ?? 0)}>
          <Coins className="w-6 h-6 mr-2" /> Mint TCO2 tokens
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>TCO2 Mint</DrawerTitle>
            <DrawerDescription>Mint new tokens for the project.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full mb-2"
                onClick={() => onClick(-10)}
                disabled={nbTokensToMint <= 9}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <Input
                  className="text-7xl font-bold tracking-tighter border-none h-17 text-center mb-2 [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  value={nbTokensToMint}
                  min={1}
                  max={10000}
                  onChange={(event) => setNbTokensToMint(Number(event.currentTarget.value))}
                />
                <div className="text-[0.70rem] uppercase text-muted-foreground">TCO2 TOKENS</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full mb-2"
                onClick={() => onClick(10)}
                disabled={nbTokensToMint > 9990}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button disabled={isPending || !isConnected} onClick={() => mint()}>
              {isPending ? <LoaderCircle className="animate-spin" /> : <>Mint</>}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
