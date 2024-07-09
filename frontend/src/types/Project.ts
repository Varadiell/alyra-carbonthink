export type Project = {
  data: {
    ares: number;
    calculationMethod: string;
    city: string;
    continent: string;
    coordinates: string;
    country: string;
    duration: number;
    expectedCo2Tons: number;
    location: string;
    plantedSpecies: string;
    province: string;
    region: string;
    startDate: number;
    unSDGs: number[];
  };
  description: string;
  documentUrls: string[];
  externalUrl: string;
  id: number;
  image: string;
  isRegistered: boolean;
  name: string;
  photoUtils: string[];
  projectHolder: `0x${string}`;
  status: number;
};

export type ProjectRaw = {
  data: {
    ares: bigint;
    calculationMethod: string;
    city: string;
    continent: string;
    coordinates: string;
    country: string;
    duration: bigint;
    expectedCo2Tons: bigint;
    location: string;
    plantedSpecies: string;
    province: string;
    region: string;
    startDate: bigint;
    unSDGs: bigint[];
  };
  description: string;
  documentUrls: string[];
  externalUrl: string;
  id: bigint;
  image: string;
  isRegistered: boolean;
  name: string;
  photoUtils: string[];
  projectHolder: `0x${string}`;
  status: bigint;
};
