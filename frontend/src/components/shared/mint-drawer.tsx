'use client';

import { LoaderCircle, Minus, Plus, Sparkles, TriangleAlert } from 'lucide-react';
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
import { projectManager } from '@/contracts/projectManager.contract';
import { useContract } from '@/hooks/useContract';
import { DataContext } from '@/contexts/data-provider';
import { projectToMetadataBase64 } from '@/utils/adapters';
import { Project } from '@/types/Project';
import { useContext, useState } from 'react';

export function MintDrawer({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [nbTokensToMint, setNbTokensToMint] = useState<number>(100);

  const {
    account,
    chainId,
    data: { projectTotalSupply, projectTotalBurnSupply },
    fetchAllProjectData,
  } = useContext(DataContext);

  const { isConnected, isPending, writeContract } = useContract(() => {
    fetchAllProjectData(project.id);
    setIsOpen(false);
    setNbTokensToMint(100);
  });

  function mint() {
    if (!chainId || !project || !account.address || projectTotalSupply == null) {
      return;
    }
    writeContract({
      ...projectManager(chainId),
      account: account.address,
      args: [
        BigInt(project.id),
        BigInt(nbTokensToMint),
        projectTotalSupply === 0 ? projectToMetadataBase64(project) : '',
      ],
      chainId,
      functionName: 'mintTokens',
    });
  }

  function onClick(adjustment: number) {
    setNbTokensToMint(Math.max(0, Math.min(10000, nbTokensToMint + adjustment)));
  }

  const remainingExpected = Math.max(
    project.data.expectedCo2Tons - (projectTotalSupply ?? 0) - (projectTotalBurnSupply ?? 0),
    0,
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="w-52" disabled={project.status !== 2}>
          <Sparkles className="w-6 h-6 mr-2" /> Mint TCO2 tokens
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>TCO2 Mint</DrawerTitle>
            <DrawerDescription>Mint new tokens for the project.</DrawerDescription>
            {remainingExpected < nbTokensToMint && (
              <DrawerDescription className="flex flex-row gap-2 text-orange-600 dark:text-orange-400">
                <TriangleAlert /> You are minting more tokens than the remaining expected number of tokens.
              </DrawerDescription>
            )}
          </DrawerHeader>
          <div className="p-1 pb-0">
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
                  value={nbTokensToMint || ''}
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
            <Button disabled={nbTokensToMint === 0 || isPending || !isConnected} onClick={() => mint()}>
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
