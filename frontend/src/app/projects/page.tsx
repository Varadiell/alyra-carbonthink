'use client';

import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Paginate } from '@/components/shared/paginate';
import { ProjectsList } from '@/components/shared/projects-list';
import { DataContext } from '@/contexts/data-provider';
import { Suspense, useContext } from 'react';

export default function Projects() {
  const {
    data: { totalProjects },
  } = useContext(DataContext);

  return (
    <>
      <Breadcrumbs layers={['Home', 'Projects']} />
      <Suspense>
        {totalProjects != null && (
          <>
            <Paginate baseUrl="/projects" nbItems={totalProjects ?? 0} pageSize={10} />
            <ProjectsList />
            <Paginate baseUrl="/projects" nbItems={totalProjects ?? 0} pageSize={10} />
          </>
        )}
      </Suspense>
    </>
  );
}
