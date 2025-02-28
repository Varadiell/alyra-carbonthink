'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { projectManager } from '@/contracts/projectManager.contract';
import { useContract } from '@/hooks/useContract';
import { useData } from '@/hooks/useData';
import { Check, CircleAlert, LoaderCircle, SquarePlus } from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function CreateProject() {
  const [ares, setAres] = useState<number>(0);
  const [calculationMethod, setCalculationMethod] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [continent, setContinent] = useState<string>('');
  const [coordinates, setCoordinates] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [expectedCo2Tons, setExpectedCo2Tons] = useState<number>(0);
  const [location, setLocation] = useState<string>('');
  const [plantedSpecies, setPlantedSpecies] = useState<string>('');
  const [province, setProvince] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [unSDGs, setUnSDGs] = useState<number[]>([]);
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [projectHolder, setProjectHolder] = useState<`0x${string}` | string>('');

  function isFormOk(): boolean {
    return !isMissingReceiver() && !isMissingDescription() && !isMissingLocation() && !isMissingImpact();
  }

  function isMissingReceiver(): boolean {
    return !projectHolder;
  }

  function isMissingDescription(): boolean {
    return !name || !image || !description || !startDate || !duration;
  }

  function isMissingLocation(): boolean {
    return !continent || !country || !region || !province || !city || !location || !coordinates;
  }

  function isMissingImpact(): boolean {
    return !ares || !plantedSpecies || !expectedCo2Tons || !calculationMethod;
  }

  const {
    account,
    chainId,
    data: { totalProjects },
    refetchTotalProjects,
  } = useData();
  const { isConnected, isPending, writeContract } = useContract(() => {
    setAres(0);
    setCalculationMethod('');
    setCity('');
    setContinent('');
    setCoordinates('');
    setCountry('');
    setDuration(0);
    setExpectedCo2Tons(0);
    setLocation('');
    setPlantedSpecies('');
    setProvince('');
    setRegion('');
    setStartDate('');
    setUnSDGs([]);
    setDescription('');
    setImage('');
    setName('');
    setProjectHolder('');
    refetchTotalProjects();
  });

  function submitAddProposal(event: React.FormEvent<HTMLFormElement>) {
    const projectId = totalProjects;
    event.preventDefault();
    if (!account.address || !chainId) {
      return;
    }
    writeContract({
      ...projectManager(chainId),
      account: account.address,
      args: [
        {
          data: {
            ares: BigInt(ares ?? 0),
            calculationMethod,
            city,
            continent,
            coordinates,
            country,
            duration: duration ?? 0,
            expectedCo2Tons: BigInt(expectedCo2Tons ?? 0),
            location,
            plantedSpecies,
            province,
            region,
            startDate: BigInt(new Date(startDate).getTime() / 1000 ?? 0),
            unSDGs,
          },
          description,
          externalUrl: `https://alyra-carbonthink.vercel.app/project/${projectId}`,
          image,
          name,
          projectHolder: projectHolder as `0x${string}`,
        },
      ],
      functionName: 'create',
    });
  }

  // TODO: if user is not allowed, redirect to "/".

  return (
    <form className="flex-row gap-6" onSubmit={submitAddProposal}>
      <Card>
        <CardHeader className="bg-muted">
          <CardTitle className="flex flex-row gap-2">
            <SquarePlus /> Create a new project
          </CardTitle>
          <CardDescription>As the admin, you can create new projects.</CardDescription>
        </CardHeader>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem className="px-6" value="item-1">
            <AccordionTrigger>
              <h3 className="text-2xl font-semibold flex flex-row gap-2 items-center">
                {isMissingReceiver() ? <CircleAlert /> : <Check />} Receiver
              </h3>
            </AccordionTrigger>

            <AccordionContent className="px-1">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="projectHolder">Project Holder Address</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="projectHolder"
                    maxLength={42}
                    minLength={42}
                    onChange={(event) => setProjectHolder(event.currentTarget.value)}
                    placeholder="0x..."
                    required={true}
                    type="text"
                    value={projectHolder}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="px-6" value="item-2">
            <AccordionTrigger>
              <h3 className="text-2xl font-semibold flex flex-row gap-2 items-center">
                {isMissingDescription() ? <CircleAlert /> : <Check />} Description
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-1">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-3 sm:col-start-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="name"
                    maxLength={100}
                    minLength={1}
                    onChange={(event) => setName(event.currentTarget.value)}
                    placeholder="Name"
                    required={true}
                    type="text"
                    value={name}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="image"
                    maxLength={100}
                    minLength={8}
                    onChange={(event) => setImage(event.currentTarget.value)}
                    placeholder="https://ipfs.io/ipfs/..."
                    required={true}
                    type="text"
                    value={image}
                  />
                </div>
                <div className="grid gap-3 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="description"
                    maxLength={250}
                    minLength={1}
                    onChange={(event) => setDescription(event.currentTarget.value)}
                    placeholder="Description"
                    required={true}
                    type="text"
                    value={description}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="startDate"
                    maxLength={100}
                    minLength={1}
                    onChange={(event) => setStartDate(event.currentTarget.value)}
                    required={true}
                    type="date"
                    value={startDate}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="duration">Duration (Years)</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="duration"
                    max={100}
                    min={1}
                    onChange={(event) => setDuration(Number(event.currentTarget.value))}
                    placeholder="10"
                    required={true}
                    type="number"
                    value={duration || ''}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="px-6" value="item-3">
            <AccordionTrigger>
              <h3 className="text-2xl font-semibold flex flex-row gap-2 items-center">
                {isMissingLocation() ? <CircleAlert /> : <Check />} Location
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-1">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="continent">Continent</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="continent"
                    maxLength={50}
                    minLength={1}
                    onChange={(event) => setContinent(event.currentTarget.value)}
                    placeholder="Continent"
                    required={true}
                    type="text"
                    value={continent}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="country"
                    maxLength={100}
                    minLength={1}
                    onChange={(event) => setCountry(event.currentTarget.value)}
                    placeholder="Country"
                    required={true}
                    type="text"
                    value={country}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="region"
                    maxLength={100}
                    minLength={1}
                    onChange={(event) => setRegion(event.currentTarget.value)}
                    placeholder="Region"
                    required={true}
                    type="text"
                    value={region}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="province"
                    maxLength={100}
                    minLength={1}
                    onChange={(event) => setProvince(event.currentTarget.value)}
                    placeholder="Province"
                    required={true}
                    type="text"
                    value={province}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="city">City</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="city"
                    maxLength={100}
                    minLength={1}
                    onChange={(event) => setCity(event.currentTarget.value)}
                    placeholder="City"
                    required={true}
                    type="text"
                    value={city}
                  />
                </div>
                <div className="grid gap-3 sm:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="location"
                    maxLength={250}
                    minLength={1}
                    onChange={(event) => setLocation(event.currentTarget.value)}
                    placeholder="Location"
                    required={true}
                    type="text"
                    value={location}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="coordinates">Coordinates</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="coordinates"
                    maxLength={40}
                    minLength={5}
                    onChange={(event) => setCoordinates(event.currentTarget.value)}
                    placeholder="Example: 47.211444, -1.576306"
                    required={true}
                    type="text"
                    value={coordinates}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="px-6" value="item-4">
            <AccordionTrigger>
              <h3 className="text-2xl font-semibold flex flex-row gap-2 items-center">
                {isMissingImpact() ? <CircleAlert /> : <Check />} Impact
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-1">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-3 sm:col-start-1">
                  <Label htmlFor="ares">Ares {!!ares && <>({ares / 100} hectares)</>} </Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="ares"
                    max={100_000_000}
                    min={1}
                    onChange={(event) => setAres(Number(event.currentTarget.value))}
                    placeholder="10000"
                    required={true}
                    type="number"
                    value={ares || ''}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="plantedSpecies">Planted Species</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="plantedSpecies"
                    maxLength={50}
                    minLength={1}
                    onChange={(event) => setPlantedSpecies(event.currentTarget.value)}
                    placeholder="Planted Species"
                    required={true}
                    type="text"
                    value={plantedSpecies}
                  />
                </div>
                <div className="grid gap-3 sm:col-start-1">
                  <Label htmlFor="expectedCo2Tons">Expected CO2 Tons</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="expectedCo2Tons"
                    max={100_000_000}
                    min={1}
                    onChange={(event) => setExpectedCo2Tons(Number(event.currentTarget.value))}
                    placeholder="500"
                    required={true}
                    type="number"
                    value={expectedCo2Tons || ''}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="calculationMethod">CO2 Calculation Method</Label>
                  <Input
                    className="w-full"
                    disabled={isPending || !isConnected}
                    id="calculationMethod"
                    maxLength={100}
                    minLength={1}
                    onChange={(event) => setCalculationMethod(event.currentTarget.value)}
                    placeholder="Calculation Method"
                    required={true}
                    type="text"
                    value={calculationMethod}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <CardFooter className="bg-muted pt-6 flex justify-start">
          <Button className="min-w-32" disabled={!isFormOk() || isPending || !isConnected} type="submit">
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                <SquarePlus className="mr-2" />
                Create project
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
