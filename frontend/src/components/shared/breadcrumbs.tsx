import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

type PageLayer = {
  label: string;
  url: string;
};

const LAYERS: PageLayer[] = [
  { label: 'Home', url: '/' },
  { label: 'Dashboard', url: '/dashboard' },
  { label: 'Projects', url: '/projects' },
  { label: 'Marketplace', url: '/marketplace' },
  { label: 'Offset', url: '/offset' },
  { label: 'Leaderboard', url: '/leaderboard' },
  { label: 'Admin', url: '/admin' },
  { label: 'Events', url: '/events' },
];

function getPageLayers(labels: string[]): PageLayer[] {
  return labels.map((label) => LAYERS.find((layer) => layer.label === label) ?? { label, url: '' });
}

export function Breadcrumbs({ layers = [] }: { layers: string[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {getPageLayers(layers).map((layer, index, array) => (
          <>
            {index > 0 && <BreadcrumbSeparator />}
            {index >= array.length - 1 ? (
              <BreadcrumbPage>{layer.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbItem>
                <Link href={layer.url}>{layer.label}</Link>
              </BreadcrumbItem>
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
