import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { CreateProject } from '@/components/shared/create-project';

export default function Admin() {
  return (
    <>
      <Breadcrumbs
        layers={[
          { label: 'Home', url: '/' },
          { label: 'Admin', url: '' },
        ]}
      />
      <CreateProject />
    </>
  );
}
