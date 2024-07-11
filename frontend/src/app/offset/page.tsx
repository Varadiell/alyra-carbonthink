'use client';

import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataContext } from '@/contexts/data-provider';
import { useContract } from '@/hooks/useContract';
import { Coins, Flame, LoaderCircle, Minus, Plus, Wallet } from 'lucide-react';
import { useContext, useState } from 'react';
import { useReadContract } from 'wagmi';
import JSConfetti from 'js-confetti';

export default function Offset() {
  const jsConfetti = new JSConfetti();
  const [targetProjectId, setTargetProjectId] = useState<number>(0);
  const [tokenAmountToBurn, setTokenAmountToBurn] = useState<number>(0);
  const {
    account: { address, totalBalance, totalBurnBalance },
    chainId,
    contracts: { tco2Contract },
    fetchUserData,
  } = useContext(DataContext);
  const { isConnected, isPending, writeContract } = useContract(() => {
    jsConfetti.addConfetti({
      emojis: ['🔥'],
      emojiSize: 30,
      confettiNumber: Math.min(tokenAmountToBurn, 500), // 500 confettis maximum.
    });
    setTokenAmountToBurn(0);
    refetchBalanceOfUserForProject();
    fetchUserData();
  });

  const { data: balanceOfUserForProject, refetch: refetchBalanceOfUserForProject } = useReadContract({
    ...tco2Contract,
    args: [address, BigInt(targetProjectId)],
    chainId,
    functionName: 'balanceOf',
    query: {
      enabled: !!address && targetProjectId != null,
      select: (balanceOfUserForProject) =>
        balanceOfUserForProject != null ? Number(balanceOfUserForProject) : undefined,
    },
  });

  function burnTokens() {
    if (!address || !tco2Contract || targetProjectId == null || tokenAmountToBurn == null || tokenAmountToBurn === 0) {
      return;
    }
    writeContract({
      ...tco2Contract,
      args: [address, BigInt(targetProjectId), BigInt(tokenAmountToBurn)],
      account: address,
      functionName: 'burn',
    });
  }

  function onClickProjectId(adjustment: number) {
    setTargetProjectId(Math.max(0, targetProjectId + adjustment));
    setTokenAmountToBurn(0);
  }

  function onClickBurn(adjustment: number) {
    setTokenAmountToBurn(Math.max(0, Math.min(tokenAmountToBurn + adjustment, balanceOfUserForProject ?? 0)));
  }

  return (
    <>
      <Breadcrumbs layers={['Home', 'Burn']} />
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Your tokens</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-row text-4xl font-bold items-center gap-2 justify-center">
                <Wallet className="h-14 w-14 text-green-500" />
                {totalBalance} <Coins className="h-8 w-8" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Currently in your wallet, across all projects.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Your burnt tokens</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-row text-4xl font-bold items-center gap-2 justify-center">
                <Flame className="h-14 w-14 text-red-500" />
                {totalBurnBalance} <Coins className="h-8 w-8" />
              </div>
              <p className="text-xs text-muted-foreground text-center">Burnt by you, across all projects.</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="bg-muted">
            <CardTitle className="text-xl font-medium">Burn tokens</CardTitle>
            <CardDescription>
              Here, you can burn your TCO2 tokens, for the planet. This action is definitive and cannot be reverted.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 p-6">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full mb-5"
                  onClick={() => onClickProjectId(-1)}
                  disabled={targetProjectId <= 0}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <Input
                    className="text-5xl font-bold tracking-tighter border-none h-14 text-center mb-2 [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    value={targetProjectId}
                    onChange={(event) => setTargetProjectId(Number(event.currentTarget.value))}
                  />
                  <div className="text-[0.70rem] uppercase text-muted-foreground">PROJECT ID</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full mb-5"
                  onClick={() => onClickProjectId(1)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full mb-5"
                  onClick={() => onClickBurn(-10)}
                  disabled={!balanceOfUserForProject || tokenAmountToBurn <= 0}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <Input
                    className="text-5xl font-bold tracking-tighter border-none h-14 text-center mb-2 [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    disabled={!balanceOfUserForProject}
                    value={tokenAmountToBurn}
                    onChange={(event) => setTokenAmountToBurn(Number(event.currentTarget.value))}
                  />
                  <div className="text-[0.70rem] uppercase text-muted-foreground">TOKENS TO BE BURNED</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full mb-5"
                  onClick={() => onClickBurn(10)}
                  disabled={!balanceOfUserForProject || tokenAmountToBurn >= (balanceOfUserForProject ?? 0)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-center align-middle items-center gap-3">
              <div className="flex flex-row items-center gap-2 text-4xl">
                {balanceOfUserForProject} <Coins className="h-7 w-7" />
              </div>
              <div className="text-center">Available to burn, on this project.</div>
            </div>
          </CardContent>
          <CardFooter className="pt-6 justify-center">
            <Button
              className="min-w-[230px]"
              disabled={targetProjectId == null || tokenAmountToBurn === 0 || isPending || !isConnected}
              onClick={() => burnTokens()}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  <Flame className="mr-2" />
                  Burn those TCO2 tokens
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
