import * as React from 'react';
import { Coins, Minus, Plus } from 'lucide-react';

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
import { useState } from 'react';

// TODO: call mint function
export function MintDrawer() {
  const [goal, setGoal] = useState<number>(100);

  function onClick(adjustment: number) {
    setGoal(Math.max(0, Math.min(10000, goal + adjustment)));
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="w-52">
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
                disabled={goal <= 9}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <Input
                  className="text-7xl font-bold tracking-tighter border-none h-17 text-center mb-2 [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  value={goal}
                  onChange={(event) => setGoal(Number(event.currentTarget.value))}
                />
                <div className="text-[0.70rem] uppercase text-muted-foreground">TCO2 TOKENS</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full mb-2"
                onClick={() => onClick(10)}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button>Mint</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
