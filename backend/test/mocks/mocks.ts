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
    coordinates: '37.903189, 13.422044',
    plantedSpecies: 'Bamboo',
    calculationMethod: 'VCS',
    unSDGs: [13, 14, 15],
  },
};

export const create_x = (index: number): ProjectManager.CreateParamsStruct => ({
  projectHolder: getRandomElement(addresses),
  name: getRandomElement(names),
  description: getRandomElement(descriptions),
  externalUrl: `https://alyra-carbonthink.vercel.app/project/${index}`,
  image: getRandomElement(images),
  data: {
    duration: getRandomNumber(5, 35),
    ares: getRandomNumber(50, 100000),
    expectedCo2Tons: getRandomNumber(10, 1000),
    startDate: getRandomNumber(1704067200, 1767225600),
    continent: getRandomElement(continents),
    country: getRandomElement(countries),
    region: getRandomElement(regions),
    province: getRandomElement(provinces),
    city: getRandomElement(cities),
    location: getRandomElement(locations),
    coordinates: getRandomElement(coordinates),
    plantedSpecies: getRandomElement(plantedSpecies),
    calculationMethod: getRandomElement(calculationMethods),
    unSDGs: generateUnSDGs(),
  },
});

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUnSDGs() {
  const numCount = Math.floor(Math.random() * 6) + 1; // Between 1 and 6 numbers to generate.
  const numbers = new Set(); // Guarantee unique values.
  while (numbers.size < numCount) {
    numbers.add(getRandomNumber(1, 16));
  }
  return (Array.from(numbers) as number[]).sort((a, b) => a - b);
}

function getRandomElement(array: string[]): string {
  return array[getRandomNumber(0, array.length - 1)];
}

const addresses = [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
  '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
  '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
  '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
  '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
  '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
  '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
  '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
  '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
  '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
  '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
  '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
  '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
  '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
  '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
];

const names = [
  'Nexus',
  'EcoCarbon',
  'Green Horizon',
  'PureAir',
  'Carbon Cycle',
  'Sustainable Carbon Network',
  'Enviro Capture',
  'Green Future',
  'Carbon Harvest',
  'Clear Sky',
  'Eco Sphere',
  'Nature Guard',
  'Green Pulse',
  'Zero Carbon',
  'Atmosphere Cure',
  'Earth Renew',
  'Carbon Quest',
];

const descriptions = [
  'A project that acts as a hub for carbon capture technology and solutions.',
  'A project focused on ecological carbon sequestration for positive environmental impact.',
  'A project aiming to capture CO2 and envision a greener, more sustainable future.',
  'A project that "guards" the atmosphere by reducing carbon emissions.',
  'A project aimed at "cleaning" the sky by reducing CO2 levels.',
  'A project aiming to improve air quality by capturing and sequestering CO2.',
  'A project that builds a sustainable network of carbon capture solutions.',
  'A project focused on innovations to complete the carbon cycle.',
  'A project that uses advanced systems to capture CO2 from the environment.',
  'A project that links carbon capture to the creation of carbon credits for a greener future.',
  'A project that "harvests" CO2 from the atmosphere for environmental benefits.',
  'A project aiming to make skies clearer and air cleaner by reducing CO2.',
  'A project that takes a holistic approach to carbon capture and management.',
  'A project that protects nature by sequestering CO2.',
  'A project aiming to create pathways to carbon neutrality.',
  'A project that captures the "pulse" of the environment by reducing CO2.',
  'An ambitious project aiming to achieve zero carbon emissions.',
  'A project that "heals" the atmosphere by removing CO2.',
  'A project aiming to renew the Earth by reducing CO2 levels.',
  'A project that embarks on a quest to reduce CO2 emissions.',
];

const images = [
  'QmZpq4777YFLQkZpxnckC7a6pvhN7YdfxDHmTkkSPPLp4y',
  'QmdMWCCcJr9oZpw8LCSLcUyGgjJqvjmTpNC1eHYerPh6Yp',
  'QmamoYQYNQsXQJtazUm8Xgc1ev5hvidhXmD43zfBE55WL3',
  'QmNiYNw5wQKT1qCn44FcmnTXY9xcpdHUbJzLhUtoH3Acyj',
  'QmXwQx49gcCaZWjz759vpbRmvvxPZRVD24qAdi9qRS3tSM',
  'QmPk9LtmafgD8xhN2JMLeTeY5N4pVTmAfQEYi5rGLTfFgL',
  'QmQVMSUD4KJZbHu1AbesZwzVdqsRzguhs9BioorFZNyZb2',
  'QmWnz2BWFxQbQCXy29VCxoBDXvcERYzucjG1zScYFUPpHK',
  'QmbWH3nCnFGgemx7bHDdgtF83rGB8WrXcHKLuZaNPTLhwu',
  'QmQQQr6HrwmBdWcJ1dTzH4prU8uas38bQwE8auMvMhQz2B',
].map((image) => `ipfs://${image}`);

const continents = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];

const countries = [
  'Nigeria',
  'South Africa',
  'China',
  'Japan',
  'India',
  'Germany',
  'France',
  'Italy',
  'United States',
  'Canade',
  'Mexico',
  'Australia',
  'New Zealand',
  'Brazil South',
  'Argentina',
  'Chile',
  'Egypt',
  'South Korea',
  'United Kingdom',
  'Cuba',
];

const regions = [
  'Lagos',
  'Gauteng',
  'Beijing',
  'Kanto',
  'Maharashtra',
  'Bavaria',
  'Ile de France',
  'Lazio',
  'California',
  'Ontario',
  'Mexico City',
  'New South Wales',
  'Auckland',
  'Sao Paulo',
  'Buenos Aires',
  'Santiago Metropolitan Region',
  'Cairo Governorate',
  'Seoul',
  'Greater London',
  'Havana Province',
];

const provinces = [
  'Bouches du Rhône',
  'Haute-Garonne',
  'Alpes-Maritimes',
  'Gironde',
  'Nord',
  'Bas-Rhin',
  'Loire-Atlantique',
  'Ile-et-Vilaine',
  'Hérault',
  'Marne',
  'Gard',
  'Somme',
  'Finistère',
  'Isère',
  'Seine-Maritime',
  'Moselle',
  'Puy-de-Dome',
  'Corse-du-Sud',
];

const cities = [
  'Lagos',
  'Abuja',
  'Johannesburg',
  'Cape Town',
  'Beijing',
  'Shanghai',
  'Tokyo',
  'Osaka',
  'Mumbai',
  'Delhi',
  'Berlin',
  'Munich',
  'Paris',
  'Marseille',
  'Rome',
  'Milan',
  'New York City',
  'Los Angeles',
  'Toronto',
  'Vancouver',
  'Mexico City',
  'Guadalajara',
  'Sydney',
  'Melbourne',
  'Auckland',
  'Wellington',
  'São Paulo',
  'Rio de Janeiro',
  'Buenos Aires',
  'Córdoba',
  'Santiago',
  'Valparaíso',
  'Cairo',
  'Alexandria',
  'Seoul',
  'Busan',
  'London',
  'Manchester',
  'Havana',
  'Santiago de Cuba',
];

const locations = [
  '23 Green Street',
  '45 Rue de la Paix',
  '7 Via Roma',
  '12 Calle Mayor',
  '34 Princes Street',
  '56 Kaiserstraße',
  '89 Kungsgatan',
  '102 Kalverstraats',
  '15 Plac Zamkowy',
  '18 Rue du Faubourg',
  '21 Praça do Comércio',
  '32 Strada Victoriei',
  '76 Piazza San Marco',
  '44 Ulitsa Tverskaya',
  "3 O'Connell Street",
];

const coordinates = [
  '47.211449, -1.576292',
  '51.507351, -0.127758',
  '48.856613, 2.352222',
  '52.520008, 13.404954',
  '41.902784, 12.496366',
  '40.712776, -74.005974',
  '34.052235, -118.243683',
  '35.689487, 139.691711',
  '37.774929, -122.419418',
  '40.416775, -3.703790',
  '55.755825, 37.617298',
  '39.904202, 116.407394',
  '-33.868820, 151.209296',
  '-22.906847, -43.172897',
  '-37.813629, 144.963058',
];

const plantedSpecies = [
  'Lavender',
  'Rose',
  'Basil',
  'Sunflower ',
  'Hosta',
  'Tomato',
  'Mint',
  'Honeysuckle',
  'Fern',
  'Peony',
  'Bamboo',
];

const calculationMethods = [
  'Verified Carbon Units (VCUs)',
  'SD VISTA PROGRAM',
  'PLASTIC PROGRAM',
  'DIGITALIZED PROGRAM',
  'CCQI (Carbon Credit Quality Initiative',
  'Australian Carbon Credit Units (ACCU)',
  'Gold Standard',
];
