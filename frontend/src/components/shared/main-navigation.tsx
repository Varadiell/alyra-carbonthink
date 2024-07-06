'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  CandlestickChart,
  DatabaseZap,
  Flame,
  LayoutDashboard,
  LucideProps,
  Menu,
  Settings,
  TreePine,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePathname } from 'next/navigation';
import { ConnectKitButton } from 'connectkit';
import { Skeleton } from '@/components/ui/skeleton';
import carbonThinkIcon from 'public/carbonthink.svg';
import { DataContext } from '@/contexts/data-provider';
import { useContext } from 'react';

type PageType = {
  count: number | undefined | null;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>>;
  label: string;
  url: string;
};

export function MainNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    data: { eventLogs },
  } = useContext(DataContext);

  const pages: PageType[] = [
    {
      count: null,
      icon: LayoutDashboard,
      label: 'Dashboard',
      url: '/dashboard',
    },
    {
      count: null,
      icon: TreePine,
      label: 'Projects',
      url: '/projects',
    },
    {
      count: null,
      icon: CandlestickChart,
      label: 'Marketplace',
      url: '/marketplace',
    },
    {
      count: null,
      icon: Flame,
      label: 'Offset',
      url: '/offset',
    },
    {
      count: null,
      icon: Trophy,
      label: 'Leaderboard',
      url: '/leaderboard',
    },
    {
      count: null,
      icon: Settings,
      label: 'Admin',
      url: '/admin',
    },
    {
      count: eventLogs?.length,
      icon: DatabaseZap,
      label: 'Events',
      url: '/events',
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image alt="CarbonThink logo" className="h-6 w-6" src={carbonThinkIcon} />
              <span>CarbonThink</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 font-medium lg:px-4">
              {pages.map((page, index) => (
                <Link
                  key={index}
                  href={page.url}
                  className={`${pathname === page.url && 'bg-muted'} flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary`}
                >
                  <page.icon className="h-4 w-4" />
                  {page.label}
                  {page.count === undefined ? (
                    <Skeleton className="ml-auto h-6 w-6 rounded-full" />
                  ) : page.count === null ? (
                    <></>
                  ) : (
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      {page.count}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold pb-6">
                  <Image alt="CarbonThink logo" className="h-6 w-6" src={carbonThinkIcon} />
                  <span>CarbonThink</span>
                </Link>
                {pages.map((page, index) => (
                  <Link
                    key={index}
                    href={page.url}
                    className={`${pathname === page.url && 'bg-muted'} mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground`}
                  >
                    <page.icon className="h-5 w-5" />
                    {page.label}
                    {page.count === undefined ? (
                      <Skeleton className="ml-auto h-6 w-6 rounded-full" />
                    ) : page.count === null ? (
                      <></>
                    ) : (
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        {page.count}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1"></div>
          <ThemeToggle />
          <ConnectKitButton showAvatar={true} showBalance={true} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-full max-w-screen-lg place-self-center">
          {children}
        </main>
      </div>
    </div>
  );
}
