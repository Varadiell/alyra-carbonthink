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

export function Breadcrumbs({ layers = [] }: { layers: PageLayer[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {layers.map((layer, index, array) => (
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
