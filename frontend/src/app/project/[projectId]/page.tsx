'use client';

import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { DataContext } from '@/contexts/data-provider';
import { ProjectInfo } from '@/components/shared/project-info';
import { useContext, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Sprout } from 'lucide-react';

export default function Project() {
  const params = useParams<{ projectId: string }>();
  const {
    data: { projects, projectTotalBurnSupply, projectTotalSupply, totalProjects },
    fetchAllProjectData,
  } = useContext(DataContext);
  const projectId = Number(params.projectId);
  const project = projects[projectId];

  useEffect(() => {
    fetchAllProjectData(projectId);
  }, [projectId]);

  if (totalProjects != null && totalProjects <= Number(projectId)) {
    return (
      <>
        <Breadcrumbs layers={['Home', 'Projects', 'Not Found']} />
        <div className="flex min-h-[40dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <Sprout className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Oops, project not found!
            </h1>
            <p className="mt-4 text-muted-foreground">
              The project you are looking for does not exist or has been moved.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {!project ? (
        <Breadcrumbs layers={['Home', 'Projects', '...']} />
      ) : (
        <Breadcrumbs layers={['Home', 'Projects', project.name]} projectId={project.id} totalProjects={totalProjects} />
      )}
      {project && projectTotalSupply != null && projectTotalBurnSupply != null ? (
        <ProjectInfo project={project} totalSupply={projectTotalSupply} totalBurnSupply={projectTotalBurnSupply} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="w-full h-[271px]" />
          <Skeleton className="w-full h-[271px]" />
          <Skeleton className="w-full h-[444px]" />
          <Skeleton className="w-full h-[444px]" />
          <Skeleton className="w-full h-[342px] sm:col-span-2" />
          <Skeleton className="w-full h-[150px]" />
          <Skeleton className="w-full h-[150px]" />
        </div>
      )}
    </>
  );
}
