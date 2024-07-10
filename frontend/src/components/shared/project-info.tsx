/* eslint-disable @next/next/no-img-element */
'use client';

import { Project } from '@/types/Project';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Calendar,
  CalendarClock,
  Camera,
  Clock,
  Coins,
  Flame,
  Flower2,
  HandCoins,
  LandPlot,
  Leaf,
  MapPin,
  ScrollText,
  Sparkles,
  Sprout,
  SquareSigma,
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ProjectActivityBadge } from '@/components/shared/project-activity-badge';
import { Badge } from '@/components/ui/badge';
import { addrToShortAddr } from '@/utils/addrToShortAddr';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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

// TODO: add document
// TODO: add photo
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
          <Button disabled={true}>Change status</Button>
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
              <AreaChart className="w-6 h-6" /> Distribution
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
            <ScrollText className="h-6 w-6" />
            Documents
          </CardTitle>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
        </CardContent>
        <CardFooter>
          <Button disabled={true}>Add document</Button>
        </CardFooter>
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
        <CardFooter>
          <Button disabled={true}>Add photo</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
