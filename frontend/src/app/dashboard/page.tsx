'use client';

import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Coins, Flame, HandCoins, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <>
      <Breadcrumbs layers={['Home', 'Dashboard']} />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Minted</CardTitle>
            <Sparkles className="h-6 w-6 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-row text-2xl font-bold items-center gap-2">
              1230 <Coins className="h-6 w-h" />
            </div>
            <p className="text-xs text-muted-foreground">Across all project.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Circulating</CardTitle>
            <HandCoins className="h-6 w-6 text-muted-foreground text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-row text-2xl font-bold items-center gap-2">
              1230 <Coins className="h-6 w-h" />
            </div>
            <p className="text-xs text-muted-foreground">Across all project.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Burnt</CardTitle>
            <Flame className="h-6 w-6 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-row text-2xl font-bold items-center gap-2">
              1230 <Coins className="h-6 w-h" />
            </div>
            <p className="text-xs text-muted-foreground">Across all project.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Fund</CardTitle>
            <ShieldCheck className="h-6 w-6 text-muted-foreground text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-row text-2xl font-bold items-center gap-2">
              1230 <Coins className="h-6 w-h" />
            </div>
            <p className="text-xs text-muted-foreground">For projects insurance.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
