'use client';

import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Paginate } from '@/components/shared/paginate';
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
        <Paginate baseUrl="/projects" nbItems={totalProjects ?? 0} pageSize={10} />
      </Suspense>
    </>
  );
}
