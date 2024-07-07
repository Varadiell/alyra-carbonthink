import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Fragment } from 'react';

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
  { label: 'Create', url: '/create' },
  { label: 'Mint', url: '/mint' },
  { label: 'Events', url: '/events' },
  { label: 'Events TCO2', url: '/eventstco2' },
];

function getPageLayers(labels: string[]): PageLayer[] {
  return labels.map((label) => LAYERS.find((layer) => layer.label === label) ?? { label, url: '' });
}

export function Breadcrumbs({ layers = [] }: { layers: string[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {getPageLayers(layers).map((layer, index, array) => (
          <Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            {index >= array.length - 1 ? (
              <BreadcrumbPage>{layer.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbItem>
                <Link href={layer.url}>{layer.label}</Link>
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
