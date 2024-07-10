'use client';

import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { MintDrawer } from '@/components/shared/mint-drawer';
import { DataContext } from '@/contexts/data-provider';
import { ProjectInfo } from '@/components/shared/project-info';
import { useContext, useEffect } from 'react';

export default function Project() {
  const params = useParams<{ projectId: string }>();
  const {
    data: { projects, projectTotalSupply },
    fetchProjectId,
    fetchProjectTotalSupply,
  } = useContext(DataContext);
  const projectId = Number(params.projectId);
  const project = projects[projectId];

  useEffect(() => {
    fetchProjectTotalSupply(projectId);
    if (!project) {
      fetchProjectId(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  console.log(projectTotalSupply);

  return (
    <>
      {!project ? (
        <Breadcrumbs layers={['Home', 'Projects', '...']} />
      ) : (
        <Breadcrumbs layers={['Home', 'Projects', project.name]} />
      )}
      {project && projectTotalSupply != null && (
        <>
          <MintDrawer project={project} />
          <ProjectInfo project={project} totalSupply={projectTotalSupply} />
        </>
      )}
    </>
  );
}
