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
  { label: 'Burn', url: '/offset' },
  { label: 'Leaderboard', url: '/leaderboard' },
  { label: 'Create', url: '/create' },
  { label: 'Mint', url: '/mint' },
  { label: 'Events', url: '/events' },
  { label: 'Events TCO2', url: '/eventstco2' },
];

function getPageLayers(labels: string[]): PageLayer[] {
  return labels.map((label) => LAYERS.find((layer) => layer.label === label) ?? { label, url: '' });
}

function calculatePage(totalProjects = 0, projectId = 0) {
  const PAGE_SIZE = 10;
  return Math.floor((totalProjects - projectId - 1) / PAGE_SIZE) + 1;
}

export function Breadcrumbs({
  layers = [],
  projectId,
  totalProjects,
}: {
  layers: string[];
  projectId?: number;
  totalProjects?: number;
}) {
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
                <Link
                  href={
                    layer.url === '/projects' ? `/projects?p=${calculatePage(totalProjects, projectId)}` : layer.url
                  }
                >
                  {layer.label}
                </Link>
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
