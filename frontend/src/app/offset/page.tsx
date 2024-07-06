import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function Offset() {
  return (
    <>
      <Breadcrumbs
        layers={[
          { label: 'Home', url: '/' },
          { label: 'Offset', url: '' },
        ]}
      />
    </>
  );
}
