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
