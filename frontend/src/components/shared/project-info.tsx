/* eslint-disable @next/next/no-img-element */
'use client';

import { Project } from '@/types/Project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Coins, MapPin, ScrollText, Sprout } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function ProjectInfo({ project, totalSupply }: { project: Project; totalSupply: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Card>
        <CardHeader className="bg-muted">
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 text-sm p-6">
          <div>Project Holder: {project.projectHolder}</div>
          <div>Status: {project.status}</div>
        </CardContent>
      </Card>
      <AspectRatio ratio={16 / 9} className="rounded-md overflow-hidden">
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
          <CardTitle className="flex flex-row gap-2 pb-4">
            <MapPin className="h-6 w-6" />
            Location
          </CardTitle>
          <div>Continent: {project.data.continent}</div>
          <div>Country: {project.data.country}</div>
          <div>Region: {project.data.region}</div>
          <div>Province: {project.data.province}</div>
          <div>City: {project.data.city}</div>
          <div>Address: {project.data.location}</div>
          <div>Coordinates: {project.data.coordinates}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-2 text-sm p-6">
          <CardTitle className="flex flex-row gap-2 pb-4">
            <Sprout className="h-6 w-6" />
            Impact
          </CardTitle>
          <div>Start date: {new Date(project.data.startDate * 1000).toDateString()}</div>
          <div>Duration: {project.data.duration} years</div>
          <div>Surface: {project.data.ares / 100} ha.</div>
          <div>Planted species: {project.data.plantedSpecies}</div>
          <div>CO2: {project.data.expectedCo2Tons} tons</div>
          <div>CO2/year: ~{Math.floor(project.data.expectedCo2Tons / project.data.duration)} tons/year</div>
          <div>Calculation method: {project.data.calculationMethod}</div>
        </CardContent>
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
