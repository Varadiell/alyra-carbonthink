'use client';

import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Coins, Flame, HandCoins, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataContext } from '@/contexts/data-provider';
import { useContext } from 'react';

// TODO: skeleton loading data
export default function Dashboard() {
  const {
    account: { totalBalance, totalBurnBalance },
    data: { totalBurnSupply, totalSupply, totalSecurityFund },
  } = useContext(DataContext);

  return (
    <>
      <Breadcrumbs layers={['Home', 'Dashboard']} />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Minted</CardTitle>
            <Sparkles className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-row text-2xl font-bold items-center gap-2">
              {(totalSupply ?? 0) + (totalBurnSupply ?? 0)} <Coins className="h-6 w-6" />
            </div>
            <p className="text-xs text-muted-foreground">Across all project.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Circulating</CardTitle>
            <HandCoins className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-row text-2xl font-bold items-center gap-2">
              {totalSupply} <Coins className="h-6 w-6" />
            </div>
            <p className="text-xs text-muted-foreground">Across all project.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Burnt</CardTitle>
            <Flame className="h-6 w-6 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-row text-2xl font-bold items-center gap-2">
              {totalBurnSupply} <Coins className="h-6 w-6" />
            </div>
            <p className="text-xs text-muted-foreground">Across all project.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Fund</CardTitle>
            <ShieldCheck className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-row text-2xl font-bold items-center gap-2">
              {totalSecurityFund} <Coins className="h-6 w-6" />
            </div>
            <p className="text-xs text-muted-foreground">For projects insurance.</p>
          </CardContent>
        </Card>
      </div>
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
            <p className="text-xs text-muted-foreground text-center">Currently in your wallet, across all projects.</p>
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
    </>
  );
}
