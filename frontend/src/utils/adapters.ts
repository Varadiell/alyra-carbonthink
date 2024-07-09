import { Project, ProjectRaw } from '@/types/Project';

export const toProject = (raw: ProjectRaw): Project => {
  return {
    ...raw,
    data: {
      ...raw.data,
      ares: Number(raw.data.ares),
      duration: Number(raw.data.duration),
      expectedCo2Tons: Number(raw.data.expectedCo2Tons),
      startDate: Number(raw.data.startDate),
      unSDGs: raw.data.unSDGs.map((e) => Number(e)),
    },
    id: Number(raw.id),
    status: Number(raw.status),
  };
};

export const projectToMetadataBase64 = (project: Project): string => {
  return btoa(
    JSON.stringify({
      name: project.name,
      description: project.description,
      external_url: project.externalUrl,
      image: project.image,
      attributes: [
        {
          display_type: 'string',
          trait_type: 'Continent',
          value: project.data.continent,
        },
        {
          display_type: 'string',
          trait_type: 'Country',
          value: project.data.country,
        },
        {
          display_type: 'string',
          trait_type: 'Region',
          value: project.data.region,
        },
        {
          display_type: 'string',
          trait_type: 'Province',
          value: project.data.province,
        },
        {
          display_type: 'string',
          trait_type: 'City',
          value: project.data.city,
        },
        {
          display_type: 'string',
          trait_type: 'Coordinates',
          value: project.data.coordinates,
        },
        {
          display_type: 'number',
          trait_type: 'Ares',
          value: project.data.ares,
        },
        {
          display_type: 'string',
          trait_type: 'Planted Species',
          value: project.data.plantedSpecies,
        },
        {
          display_type: 'string',
          trait_type: 'CO2 Calculations Method',
          value: project.data.calculationMethod,
        },
        {
          display_type: 'number',
          trait_type: 'Expected CO2 Tons',
          value: project.data.expectedCo2Tons,
        },
        {
          display_type: 'number',
          trait_type: 'Duration (Years)',
          value: project.data.duration,
        },
        {
          display_type: 'date',
          trait_type: 'Start Date',
          value: project.data.startDate,
        },
      ],
    }),
  );
};
