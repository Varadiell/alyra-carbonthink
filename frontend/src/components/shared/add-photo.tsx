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
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AddPhoto({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [photoToAdd, setPhotoToAdd] = useState<string>('');
  const {
    account,
    contracts: { projectManagerContract },
    fetchAllProjectData,
  } = useData();
  const { isConnected, isPending, writeContract } = useContract(() => {
    fetchAllProjectData(project.id);
    setIsOpen(false);
    setPhotoToAdd('');
  });

  function addPhoto() {
    if (!projectManagerContract || !photoToAdd) {
      return;
    }
    writeContract({
      ...projectManagerContract,
      account: account.address,
      args: [BigInt(project.id), photoToAdd],
      functionName: 'addPhoto',
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={isPending || !isConnected || [0, 3].includes(project.status)}>
          <ImagePlus className="h-5 w-5 mr-2" />
          Add photo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add photo</DialogTitle>
          <DialogDescription>Add a photo for the current project.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-rows-2 items-center mb-5">
            <Label htmlFor="photo">Photo IPFS link</Label>
            <Input
              className="w-full"
              disabled={isPending || !isConnected}
              id="photo"
              maxLength={100}
              minLength={10}
              onChange={(event) => setPhotoToAdd(event.currentTarget.value)}
              placeholder="ipfs://..."
              required={true}
              type="text"
              value={photoToAdd}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            disabled={photoToAdd.length === 0 || isPending || !isConnected}
            onClick={() => addPhoto()}
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : <>Save changes</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
