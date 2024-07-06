import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function Project() {
  return (
    <>
      <Breadcrumbs
        layers={[
          { label: 'Home', url: '/' },
          { label: 'Projects', url: '/projects' },
          { label: '<project name>', url: '' }, // TODO: project name
        ]}
      />
    </>
  );
}
