'use client';

import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Coins, Flame, HandCoins, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataContext } from '@/contexts/data-provider';
import { useContext, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Link from 'next/link';

export default function Dashboard() {
  const {
    account: { isConnected, totalBalance, totalBurnBalance },
    data: { totalBurnSupply, totalSupply, totalSecurityFund, projects },
    queries: { projectsBatchIsLoading },
    fetchProjectsPage,
  } = useContext(DataContext);

  useEffect(() => {
    fetchProjectsPage(1); // Always first page in order to have the latest projects.
  }, []);

  return (
    <>
      <Breadcrumbs layers={['Home', 'Dashboard']} />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {totalSupply != null && totalBurnSupply != null ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Minted</CardTitle>
              <Sparkles className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-row text-2xl font-bold items-center gap-2">
                {totalSupply + totalBurnSupply} <Coins className="h-6 w-6" />
              </div>
              <p className="text-xs text-muted-foreground">Across all project.</p>
            </CardContent>
          </Card>
        ) : (
          <Skeleton className="w-full h-[130px]" />
        )}
        {totalSupply == null ? (
          <Skeleton className="w-full h-[130px]" />
        ) : (
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
        )}
        {totalBurnSupply == null ? (
          <Skeleton className="w-full h-[130px]" />
        ) : (
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
        )}
        {totalSecurityFund == null ? (
          <Skeleton className="w-full h-[130px]" />
        ) : (
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
        )}
      </div>
      {isConnected && (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {totalBalance == null ? (
            <Skeleton className="w-full h-[166px]" />
          ) : (
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
          )}
          {totalBalance == null ? (
            <Skeleton className="w-full h-[166px]" />
          ) : (
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
          )}
        </div>
      )}
      {!projectsBatchIsLoading && projects.length > 1 && (
        <>
          <div className="text-2xl font-bold">Latest Projects</div>
          <Carousel className="md:grid-cols-1 lg:grid-cols-2 rounded-lg overflow-hidden">
            <CarouselContent>
              {[...projects]
                .reverse()
                .slice(0, 5)
                .map((project, index) => (
                  <CarouselItem className="max-w-[600px] max-h-[400px]" key={index}>
                    {project && (
                      <Link href={`/project/${project.id}`}>
                        <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden mt-1">
                          <div className="animate-pulse dark:bg-gray-600 bg-gray-300 h-full w-full absolute -z-10"></div>
                          <img
                            className="w-full z-10"
                            style={{
                              transform: 'translate(-50%, -50%)',
                              top: '50%',
                              left: '50%',
                              position: 'absolute',
                            }}
                            src={`https://ipfs.io/ipfs/${project.image.replace('https://ipfs.io/ipfs/', '').replace('ipfs://', '')}`}
                            alt={`project photo ${index}`}
                            onError={(e: any) => (e.target.src = '/images/image-placeholder.webp')}
                          />
                        </AspectRatio>
                        <div className="inset-0 flex flex-col items-center justify-center p-6 text-center text-white z-10">
                          <h3 className="text-3xl font-bold tracking-tight transition-all duration-300 group-hover:translate-y-4">
                            {project.name}
                          </h3>
                          <p className="mt-4 max-w-[300px] text-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            {project.description}
                          </p>
                        </div>
                      </Link>
                    )}
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-20 top-[163px]" />
            <CarouselNext className="absolute right-20 top-[163px]" />
          </Carousel>
        </>
      )}
    </>
  );
}
