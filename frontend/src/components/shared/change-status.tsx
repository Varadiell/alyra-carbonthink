'use client';

import { Project } from '@/types/Project';
import { Button } from '@/components/ui/button';
import { useData } from '@/hooks/useData';
import { useContract } from '@/hooks/useContract';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderCircle, SquareActivity } from 'lucide-react';

export function ChangeStatus({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string | undefined>(undefined);
  const {
    account,
    contracts: { projectManagerContract },
    fetchAllProjectData,
  } = useData();
  const { isConnected, isPending, writeContract } = useContract(() => {
    fetchAllProjectData(project.id);
    setIsOpen(false);
    setNewStatus(undefined);
  });

  function changeStatus() {
    if (!projectManagerContract || newStatus == null) {
      return;
    }
    writeContract({
      ...projectManagerContract,
      account: account.address,
      args: [BigInt(project.id), BigInt(newStatus)],
      functionName: 'setStatus',
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={isPending || !isConnected || [0, 3].includes(project.status)}>
          <SquareActivity className="h-5 w-5 mr-2" />
          Change status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change status</DialogTitle>
          <DialogDescription>
            Change the status of the project. An "Active" status will allow token minting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-rows-2 items-center mb-5">
            <Label htmlFor="status">Status</Label>
            <Select required={true} value={newStatus} onValueChange={(value) => setNewStatus(value)}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="0">Canceled</SelectItem>
                  {project.status !== 1 && <SelectItem value="1">Pending</SelectItem>}
                  {project.status !== 2 && <SelectItem value="2">Active</SelectItem>}
                  <SelectItem value="3">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" disabled={isPending || !isConnected} onClick={() => changeStatus()}>
            {isPending ? <LoaderCircle className="animate-spin" /> : <>Save changes</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
