/* eslint-disable @next/next/no-img-element */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataContext } from '@/contexts/data-provider';
import { useSearchParams } from 'next/navigation';
import { useContext } from 'react';
import { AspectRatio } from '../ui/aspect-ratio';

const PAGE_SIZE = 10;

export function ProjectsList() {
  const searchParams = useSearchParams();
  const pageIndex = Number(searchParams.get('p') ?? 1);

  const {
    data: { projects, totalProjects = 0 },
  } = useContext(DataContext);

  // TODO: pagination
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 justify-items-center items-start">
      {[...new Array(PAGE_SIZE)]
        .map((_, index) => projects[Math.max(totalProjects - index - Math.max(pageIndex - 1, 0) * PAGE_SIZE - 1, 0)])
        .map((project, index) => {
          if (!project) return;
          return (
            <Card key={index} className="w-full max-w-[490px]">
              <CardHeader className="bg-muted">
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden mt-6">
                  <div className="animate-pulse dark:bg-gray-600 bg-gray-300 h-full w-full absolute -z-10"></div>
                  <img
                    className="w-full z-10"
                    style={{ transform: 'translate(-50%, -50%)', top: '50%', left: '50%', position: 'absolute' }}
                    src={`https://ipfs.io/ipfs/${project.image.replace('ipfs://', '')}`}
                    alt={`image project ${project.id}`}
                    onError={(e: any) => (e.target.src = '/image-placeholder.webp')}
                  />
                </AspectRatio>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
