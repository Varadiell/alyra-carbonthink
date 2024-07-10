'use client';

import { Activity, Check, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/Project';

export function ProjectActivityBadge({ project }: { project: Project }) {
  const projectDateStart = new Date(project.data.startDate * 1000);
  const dateNow = new Date();

  return (
    <>
      {project.status === 0 ? (
        <Badge variant="destructive">
          <Check className="w-3 h-3 mr-1" />
          Canceled
        </Badge>
      ) : project.status === 2 && projectDateStart.getTime() < dateNow.getTime() ? (
        <Badge>
          <Activity className="w-3 h-3 mr-1" />
          Live
        </Badge>
      ) : project.status === 2 ? (
        <Badge>
          <Clock className="w-3 h-3 mr-1" />
          Starting
        </Badge>
      ) : project.status === 3 ? (
        <Badge variant="secondary">
          <Check className="w-3 h-3 mr-1" />
          Complete
        </Badge>
      ) : (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )}
    </>
  );
}
