/* eslint-disable @next/next/no-img-element */
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DataContext } from '@/contexts/data-provider';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Calendar, Clock, LandPlot, Leaf, MapPin } from 'lucide-react';
import { ProjectActivityBadge } from '@/components/shared/project-activity-badge';
import Link from 'next/link';

const PAGE_SIZE = 10;

export function ProjectsList() {
  const searchParams = useSearchParams();
  const pageIndex = Number(searchParams.get('p') ?? 1);

  const {
    data: { projects, totalProjects = 0 },
    fetchProjectsPage,
  } = useContext(DataContext);

  useEffect(() => {
    fetchProjectsPage(pageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 justify-items-center items-start">
      {[...new Array(PAGE_SIZE)]
        .map((_, index) => projects[totalProjects - index - Math.max(pageIndex - 1, 0) * PAGE_SIZE - 1])
        .filter((e) => !!e)
        .map((project, index) => {
          if (!project) {
            return;
          }
          const projectDateStart = new Date(project.data.startDate * 1000);
          const dateNow = new Date();
          return (
            <Link
              className="w-full max-w-[490px] hover:-translate-y-1 transition-transform"
              href={`/project/${project.id}`}
              key={index}
            >
              <Card className="hover:border-[green] overflow-hidden">
                <CardHeader className="bg-muted">
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative top-[35px] right-[10px] z-20 float-end">
                    <ProjectActivityBadge project={project} />
                  </div>
                  <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden mt-6">
                    <div className="animate-pulse dark:bg-gray-600 bg-gray-300 h-full w-full absolute -z-10"></div>
                    <img
                      className="w-full z-10"
                      style={{ transform: 'translate(-50%, -50%)', top: '50%', left: '50%', position: 'absolute' }}
                      src={`https://ipfs.io/ipfs/${project.image.replace('ipfs://', '')}`}
                      alt={`image project ${project.id}`}
                      onError={(e: any) => (e.target.src = '/image-placeholder.webp')}
                    />
                  </AspectRatio>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-3 text-sm">
                  <div className="flex flex-row gap-1">
                    <MapPin className="h-5 w-5" /> {project.data.continent}, {project.data.region}
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="flex-1 flex flex-row gap-1">
                      <LandPlot className="h-5 w-5" /> Surface:{' '}
                      <span className="text-green-700 dark:text-green-500">{project.data.ares / 100} ha.</span>
                    </div>
                    <div className="flex flex-row gap-1 justify-end">
                      <Leaf className="h-5 w-5" /> CO2:
                      <span className="text-green-700 dark:text-green-500">{project.data.expectedCo2Tons} tons</span>
                    </div>
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="flex-1 flex flex-row gap-1">
                      <Calendar className="h-5 w-5" />
                      {projectDateStart.toDateString()}
                    </div>
                    <div className="flex flex-row gap-1 justify-end">
                      <Clock className="h-5 w-5" /> Duration:{' '}
                      <span className="text-green-700 dark:text-green-500">{project.data.duration} years</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
    </div>
  );
}
