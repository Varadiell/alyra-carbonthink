'use client';

import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { EventsList } from '@/components/shared/events-list';
import { DataContext } from '@/contexts/data-provider';
import { Suspense, useContext } from 'react';

export default function Events() {
  const {
    data: { eventLogs },
  } = useContext(DataContext);

  return (
    <>
      <Breadcrumbs layers={['Home', 'Events']} />
      <Suspense>
        <EventsList eventLogs={eventLogs} />
      </Suspense>
    </>
  );
}
