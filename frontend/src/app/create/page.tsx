import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { CreateProject } from '@/components/shared/create-project';

export default function Create() {
  return (
    <>
      <Breadcrumbs layers={['Home', 'Create']} />
      <CreateProject />
    </>
  );
}
