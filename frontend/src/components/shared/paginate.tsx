'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';

export function Paginate({ baseUrl, nbItems, pageSize }: { baseUrl: string; nbItems: number; pageSize: number }) {
  const searchParams = useSearchParams();
  const nbPages = Math.floor(nbItems / pageSize) + 1;
  const pageIndex = Number(searchParams.get('p') ?? 1);

  return (
    <Pagination>
      <PaginationContent>
        {pageIndex - 1 >= 1 && (
          <PaginationItem>
            <PaginationPrevious href={baseUrl + `?p=${pageIndex - 1}`} />
          </PaginationItem>
        )}
        {pageIndex >= 4 && (
          <PaginationItem className="max-lg:hidden">
            <PaginationLink href={baseUrl + '?p=1'}>1</PaginationLink>
          </PaginationItem>
        )}
        {pageIndex >= 5 && (
          <PaginationItem className="max-lg:hidden">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pageIndex >= 3 && (
          <PaginationItem className="max-sm:hidden">
            <PaginationLink href={baseUrl + `?p=${pageIndex - 2}`}>{pageIndex - 2}</PaginationLink>
          </PaginationItem>
        )}
        {pageIndex >= 2 && (
          <PaginationItem className="max-sm:hidden">
            <PaginationLink href={baseUrl + `?p=${pageIndex - 1}`}>{pageIndex - 1}</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive={true} href={baseUrl + `?p=${pageIndex}`}>
            {pageIndex}
          </PaginationLink>
        </PaginationItem>
        {pageIndex < nbPages && (
          <PaginationItem>
            <PaginationLink href={baseUrl + `?p=${pageIndex + 1}`}>{pageIndex + 1}</PaginationLink>
          </PaginationItem>
        )}
        {pageIndex < nbPages - 1 && (
          <PaginationItem>
            <PaginationLink href={baseUrl + `?p=${pageIndex + 2}`}>{pageIndex + 2}</PaginationLink>
          </PaginationItem>
        )}
        {pageIndex < nbPages - 3 && (
          <PaginationItem className="max-lg:hidden">
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pageIndex < nbPages - 2 && (
          <PaginationItem className="max-lg:hidden">
            <PaginationLink href={baseUrl + `?p=${nbPages}`}>{nbPages}</PaginationLink>
          </PaginationItem>
        )}
        {pageIndex < nbPages && (
          <PaginationItem>
            <PaginationNext href={baseUrl + `?p=${pageIndex + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
