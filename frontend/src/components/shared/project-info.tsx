/* eslint-disable @next/next/no-img-element */
'use client';

import { Project } from '@/types/Project';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  CalendarClock,
  Camera,
  Clock,
  Coins,
  ExternalLink,
  Files,
  Flame,
  Flower2,
  HandCoins,
  LandPlot,
  Leaf,
  LineChart,
  MapPin,
  Sparkles,
  Sprout,
  SquareSigma,
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ProjectActivityBadge } from '@/components/shared/project-activity-badge';
import { Badge } from '@/components/ui/badge';
import { addrToShortAddr } from '@/utils/addrToShortAddr';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { MintDrawer } from '@/components/shared/mint-drawer';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/charts';
import { Label, Pie, PieChart } from 'recharts';
import { ChangeStatus } from '@/components/shared/change-status';
import { AddDocument } from '@/components/shared/add-document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AddPhoto } from '@/components/shared/add-photo';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Link from 'next/link';

const chartConfig = {
  tokens: {
    label: 'Tokens',
  },
  circulating: {
    label: 'Circulating',
    color: 'hsl(var(--chart-2))',
  },
  burnt: {
    label: 'Burnt',
    color: 'hsl(var(--chart-5))',
  },
  expected: {
    label: 'Expected',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ProjectInfo({
  project,
  totalSupply,
  totalBurnSupply,
}: {
  project: Project;
  totalSupply: number;
  totalBurnSupply: number;
}) {
  const chartData = [
    { status: 'circulating', tokens: totalSupply, fill: 'var(--color-circulating)' },
    { status: 'burnt', tokens: totalBurnSupply, fill: 'var(--color-burnt)' },
    {
      status: 'expected',
      tokens: Math.max(project.data.expectedCo2Tons - totalSupply - totalBurnSupply, 0),
      fill: 'var(--color-expected)',
    },
  ];

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
        <CardFooter>
          <ChangeStatus project={project} />
        </CardFooter>
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
          onError={(e: any) => (e.target.src = '/images/image-placeholder.webp')}
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
      <Card>
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
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="text-sm">
            <CardTitle className="flex flex-row gap-2 p-6 pb-10">
              <Coins className="h-6 w-6" />
              TCO2 Tokens
            </CardTitle>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="flex flex-row items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Total Minted
                  </TableCell>
                  <TableCell className="text-end">{totalSupply + totalBurnSupply}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex flex-row items-center">
                    <HandCoins className="h-4 w-4 mr-2" />
                    Total Circulating
                  </TableCell>
                  <TableCell className="text-end">{totalSupply}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex flex-row items-center">
                    <Flame className="h-4 w-4 mr-2" />
                    Total Burnt
                  </TableCell>
                  <TableCell className="text-end">{totalBurnSupply}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex flex-row items-center">
                    <CalendarClock className="h-4 w-4 mr-2" />
                    Total Expected
                  </TableCell>
                  <TableCell className="text-end">
                    {Math.max(project.data.expectedCo2Tons - totalSupply - totalBurnSupply, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <CardTitle className="flex gap-2 p-6">
              <LineChart className="w-6 h-6" /> Distribution
            </CardTitle>
            <CardDescription className="flex justify-center">TCO2 tokens.</CardDescription>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="tokens"
                  nameKey="status"
                  innerRadius={50}
                  strokeWidth={10}
                  startAngle={450}
                  endAngle={90}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                              {Math.max(project.data.expectedCo2Tons, totalSupply + totalBurnSupply).toLocaleString()}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                              TOKENS
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
        <CardFooter>
          <MintDrawer project={project} />
        </CardFooter>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-2 text-sm p-6">
          <CardTitle className="flex flex-row gap-2 pb-4">
            <Files className="h-6 w-6" />
            Documents
          </CardTitle>
          {project.documentUrls.length === 0 && <div>No document provided.</div>}
        </CardContent>
        {project.documentUrls.length > 0 && (
          <ScrollArea className={project.documentUrls.length >= 6 ? 'h-[295px]' : ''}>
            <Table>
              <TableBody>
                {project.documentUrls.map((documentUrl, index) => (
                  <TableRow key={index}>
                    <TableCell className="p-0">
                      <Link
                        className="flex flex-row h-full w-full gap-2 p-4 text-blue-800 hover:text-blue-300 dark:text-blue-600 dark:hover:text-blue-200 transition-colors"
                        href={documentUrl}
                        target="_blank"
                      >
                        Document #{index + 1}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
        <CardFooter className="p-6">
          <AddDocument project={project} />
        </CardFooter>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-2 text-sm p-6">
          <CardTitle className="flex flex-row gap-2 pb-4">
            <Camera className="h-6 w-6" />
            Photos
          </CardTitle>
          {project.photoUrls.length === 0 && <div>No photo provided.</div>}
        </CardContent>
        <Carousel className="ml-4 mr-4">
          <CarouselContent>
            {project.photoUrls.map((photoUrl, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden mt-1">
                  <div className="animate-pulse dark:bg-gray-600 bg-gray-300 h-full w-full absolute -z-10"></div>
                  <img
                    className="w-full z-10"
                    style={{ transform: 'translate(-50%, -50%)', top: '50%', left: '50%', position: 'absolute' }}
                    src={`https://ipfs.io/ipfs/${photoUrl.replace('ipfs://', '')}`}
                    alt={`project photo ${index}`}
                    onError={(e: any) => (e.target.src = '/images/image-placeholder.webp')}
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-[28px]" />
          <CarouselNext className="absolute right-2 top-[28px]" />
        </Carousel>
        <CardFooter className="p-6">
          <AddPhoto project={project} />
        </CardFooter>
      </Card>
    </div>
  );
}
