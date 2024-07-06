import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function Marketplace() {
  return (
    <>
      <Breadcrumbs
        layers={[
          { label: 'Home', url: '/' },
          { label: 'Marketplace', url: '' },
        ]}
      />
    </>
  );
}
