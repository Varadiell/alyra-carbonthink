/* eslint-disable @next/next/no-img-element */
'use client';

import { Project } from '@/types/Project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Camera,
  Clock,
  Coins,
  Flower2,
  LandPlot,
  Leaf,
  MapPin,
  ScrollText,
  Sprout,
  SquareSigma,
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ProjectActivityBadge } from '@/components/shared/project-activity-badge';
import { Badge } from '@/components/ui/badge';
import { addrToShortAddr } from '@/utils/addrToShortAddr';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export function ProjectInfo({ project, totalSupply }: { project: Project; totalSupply: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Card>
        <CardHeader className="bg-muted">
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-2">
            <div>Project Holder:</div>
            <Badge className="w-fit text-sm" variant="outline">
              {addrToShortAddr(project.projectHolder)}
            </Badge>
          </div>
        </CardContent>
      </Card>
      <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden">
        <div className="absolute top-[15px] right-[15px] z-20 float-end">
          <ProjectActivityBadge project={project} />
        </div>
        <div className="animate-pulse dark:bg-gray-600 bg-gray-300 h-full w-full absolute -z-10"></div>
        <img
          className="min-h-full min-w-full object-center object-cover z-10"
          src={`https://ipfs.io/ipfs/${project.image.replace('ipfs://', '')}`}
          alt={`image project ${project.id}`}
          onError={(e: any) => (e.target.src = '/image-placeholder.webp')}
        />
      </AspectRatio>
      <Card>
        <CardContent className="flex flex-col gap-2 text-sm p-6">
          <CardTitle className="flex flex-row gap-2">
            <MapPin className="h-6 w-6" />
            Location
          </CardTitle>
        </CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Continent</TableCell>
              <TableCell>{project.data.continent}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Country</TableCell>
              <TableCell>{project.data.country}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Region</TableCell>
              <TableCell>{project.data.region}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Province</TableCell>
              <TableCell>{project.data.province}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell>{project.data.city}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>{project.data.location}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Coordinates</TableCell>
              <TableCell>{project.data.coordinates}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      <Card className="h-fit">
        <CardContent className="flex flex-col gap-2 text-sm p-6">
          <CardTitle className="flex flex-row gap-2">
            <Sprout className="h-6 w-6" />
            Impact
          </CardTitle>
        </CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="flex flex-row items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Start Date
              </TableCell>
              <TableCell>{new Date(project.data.startDate * 1000).toDateString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex flex-row items-center">
                <Clock className="h-4 w-4 mr-2" />
                Duration
              </TableCell>
              <TableCell>{project.data.duration} years</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex flex-row items-center">
                <LandPlot className="h-4 w-4 mr-2" />
                Surface
              </TableCell>
              <TableCell>{project.data.ares / 100} ha.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex flex-row items-center">
                <Flower2 className="h-4 w-4 mr-2" />
                Planted species
              </TableCell>
              <TableCell>{project.data.plantedSpecies}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex flex-row items-center">
                <Leaf className="h-4 w-4 mr-2" />
                CO2
              </TableCell>
              <TableCell>
                {project.data.expectedCo2Tons} tons (~
                {Math.floor(project.data.expectedCo2Tons / project.data.duration)}/year)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex flex-row items-center">
                <SquareSigma className="h-4 w-4 mr-2" />
                Calculation method
              </TableCell>
              <TableCell>{project.data.calculationMethod}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      <Card className="sm:col-span-2">
        <CardContent className="flex flex-col gap-2 text-sm p-6">
          <CardTitle className="flex flex-row gap-2 pb-4">
            <Coins className="h-6 w-6" />
            TCO2 Tokens
          </CardTitle>
          <div>Insert graphs</div>
          <div>Minted: {totalSupply} TCO2 tokens</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-2 text-sm p-6">
          <CardTitle className="flex flex-row gap-2 pb-4">
            <ScrollText className="h-6 w-6" />
            Documents
          </CardTitle>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-2 text-sm p-6">
          <CardTitle className="flex flex-row gap-2 pb-4">
            <Camera className="h-6 w-6" />
            Photos
          </CardTitle>
          <div>Carousel</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </CardContent>
      </Card>
    </div>
  );
}
