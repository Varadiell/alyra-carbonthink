import { ProjectManager } from '@/typechain-types';

export const CREATE_1: ProjectManager.CreateParamsStruct = {
  projectHolder: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // addr1
  name: 'Project 1',
  description: 'The first CarbonThink project.',
  externalUrl: 'https://alyra-carbonthink.vercel.app/project/0',
  image: 'ipfs://bafybeifkvccastjvmile7ovjnuhdahy3gsv2omoppr5zqzlimchwpz4vli/',
  data: {
    duration: 15,
    ares: 40000,
    expectedCo2Tons: 120,
    startDate: 1710889200,
    continent: 'Europe',
    country: 'France',
    region: 'Pays de la Loire',
    province: 'Loire-Atlantique',
    city: 'Nantes',
    location: 'Place Général Mellinet',
    coordinates: '47.211449, -1.576292',
    plantedSpecies: 'Bamboo',
    calculationMethod: 'VCS',
    unSDGs: [6, 11, 12, 13, 14, 15],
  },
};

export const CREATE_2: ProjectManager.CreateParamsStruct = {
  projectHolder: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // addr2
  name: 'Project 2',
  description: 'The second CarbonThink project.',
  externalUrl: 'https://alyra-carbonthink.vercel.app/project/1',
  image: 'ipfs://bafybeifkvccastjvmile7ovjnuhdahy3gsv2omoppr5zqzlimchwpz4vli/',
  data: {
    duration: 20,
    ares: 60000,
    expectedCo2Tons: 260,
    startDate: 1710889200,
    continent: 'Europe',
    country: 'Italy',
    region: 'Sicily',
    province: 'Palermo',
    city: 'Godrano',
    location: 'Fercolor Di Bellini Giuseppa',
    coordinates: '37.904032, 13.428902',
    plantedSpecies: 'Bamboo',
    calculationMethod: 'VCS',
    unSDGs: [13, 14, 15],
  },
};
