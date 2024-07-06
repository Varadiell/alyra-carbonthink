import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function Leaderboard() {
  return (
    <>
      <Breadcrumbs
        layers={[
          { label: 'Home', url: '/' },
          { label: 'Leaderboard', url: '' },
        ]}
      />
    </>
  );
}
