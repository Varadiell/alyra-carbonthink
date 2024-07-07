import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { EventsList } from '@/components/shared/events-list';

export default function Events() {
  return (
    <>
      <Breadcrumbs layers={['Home', 'Events']} />
      <EventsList />
    </>
  );
}
