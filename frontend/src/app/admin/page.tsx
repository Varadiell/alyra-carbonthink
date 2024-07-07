import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { CreateProject } from '@/components/shared/create-project';

export default function Admin() {
  return (
    <>
      <Breadcrumbs layers={['Home', 'Admin']} />
      <CreateProject />
    </>
  );
}
