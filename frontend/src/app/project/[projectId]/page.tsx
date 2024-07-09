'use client';

import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { MintDrawer } from '@/components/shared/mint-drawer';
import { DataContext } from '@/contexts/data-provider';
import { useContext, useEffect } from 'react';

export default function Project() {
  const params = useParams<{ projectId: string }>();
  const {
    data: { projects },
    fetchProjectId,
  } = useContext(DataContext);
  const projectId = Number(params.projectId);

  useEffect(() => {
    if (!projects[projectId]) {
      fetchProjectId(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  return (
    <>
      <Breadcrumbs layers={['Home', 'Projects', projects?.[projectId]?.name ?? '']} />
      <MintDrawer />
    </>
  );
}
