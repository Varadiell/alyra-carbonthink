import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function Home() {
  return (
    <>
      <Breadcrumbs layers={[{ label: 'Home', url: '' }]} />
    </>
  );
}
