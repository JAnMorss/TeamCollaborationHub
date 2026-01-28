"use client";

import { projectsApiConnector } from "@/api/projects/project.api";
import { Card, CardContent } from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function ProjectsStatsCard() {
  const { data } = useSuspenseQuery({
    queryKey: ["projects", "all"],
    queryFn: projectsApiConnector.getAllProjects,
  });

  const projects = data.data.items;

  const active = projects.filter(p => p.isActive && !p.isArchived).length;
  const archived = projects.filter(p => p.isArchived).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-3xl font-bold">{projects.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-3xl font-bold">{active}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Archived</p>
          <p className="text-3xl font-bold">{archived}</p>
        </CardContent>
      </Card>
    </div>
  );
}
