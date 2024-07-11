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
import { FilePlus, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AddDocument({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [documentToAdd, setDocumentToAdd] = useState<string>('');
  const {
    account,
    contracts: { projectManagerContract },
    fetchAllProjectData,
  } = useData();
  const { isConnected, isPending, writeContract } = useContract(() => {
    fetchAllProjectData(project.id);
    setIsOpen(false);
    setDocumentToAdd('');
  });

  function addDocument() {
    if (!projectManagerContract || !documentToAdd) {
      return;
    }
    writeContract({
      ...projectManagerContract,
      account: account.address,
      args: [BigInt(project.id), documentToAdd],
      functionName: 'addDocument',
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={isPending || !isConnected || [0, 3].includes(project.status)}>
          <FilePlus className="h-5 w-5 mr-2" />
          Add document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add document</DialogTitle>
          <DialogDescription>Add a document for the current project.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-rows-2 items-center mb-5">
            <Label htmlFor="document">Document IPFS link</Label>
            <Input
              className="w-full"
              disabled={isPending || !isConnected}
              id="document"
              maxLength={100}
              minLength={10}
              onChange={(event) => setDocumentToAdd(event.currentTarget.value)}
              placeholder="ipfs://..."
              required={true}
              type="text"
              value={documentToAdd}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            disabled={documentToAdd.length === 0 || isPending || !isConnected}
            onClick={() => addDocument()}
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : <>Save changes</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
