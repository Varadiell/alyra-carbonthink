import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function Projects() {
  return (
    <>
      <Breadcrumbs
        layers={[
          { label: 'Home', url: '/' },
          { label: 'Projects', url: '' },
        ]}
      />
    </>
  );
}
