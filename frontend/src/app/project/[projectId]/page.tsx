import { Breadcrumbs } from '@/components/shared/breadcrumbs';

// TODO: project name
export default function Project() {
  return (
    <>
      <Breadcrumbs layers={['Home', 'Projects', '<project name>']} />
    </>
  );
}
