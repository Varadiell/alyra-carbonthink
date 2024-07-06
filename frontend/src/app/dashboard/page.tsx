import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function Dashboard() {
  return (
    <>
      <Breadcrumbs
        layers={[
          { label: 'Home', url: '/' },
          { label: 'Dashboard', url: '' },
        ]}
      />
    </>
  );
}
