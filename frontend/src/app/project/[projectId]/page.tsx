'use client';

import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { DataContext } from '@/contexts/data-provider';
import { ProjectInfo } from '@/components/shared/project-info';
import { useContext, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Project() {
  const params = useParams<{ projectId: string }>();
  const {
    data: { projects, projectTotalBurnSupply, projectTotalSupply },
    fetchAllProjectData,
  } = useContext(DataContext);
  const projectId = Number(params.projectId);
  const project = projects[projectId];

  useEffect(() => {
    fetchAllProjectData(projectId);
  }, [projectId]);

  return (
    <>
      {!project ? (
        <Breadcrumbs layers={['Home', 'Projects', '...']} />
      ) : (
        <Breadcrumbs layers={['Home', 'Projects', project.name]} />
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
