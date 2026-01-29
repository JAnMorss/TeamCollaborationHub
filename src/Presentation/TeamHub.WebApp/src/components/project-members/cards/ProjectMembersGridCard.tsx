"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApiConnector } from "@/api/projects/project.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectMember, Project } from "@/schemas/projects/project.schema";

export default function ProjectMembersGridCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project-members"],
    queryFn: () => projectsApiConnector.getAllProjects(),
  });

  const projects: Project[] = data?.data.items ?? [];

  const members: (ProjectMember & { projectName: string; projectId: string })[] = projects.flatMap((project) =>
    Array.isArray(project.members)
      ? project.members.map((member) => ({ ...member, projectName: project.name, projectId: project.id }))
      : []
  );

  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectsApiConnector.removeProjectMember(projectId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project-members"] }),
  });

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Project Members
        </CardTitle>
        <Badge variant="secondary">{members.length}</Badge>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <p className="text-center text-sm text-destructive py-10">
            Failed to load members
          </p>
        ) : members.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-10">
            No members found
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <Card
                key={member.id}
                className="group relative transition-transform transform hover:scale-[1.02] hover:shadow-xl rounded-2xl overflow-hidden bg-card p-6"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  aria-label="Remove member"
                  onClick={() => removeMemberMutation.mutate({ projectId: member.projectId, userId: member.userId })}
                >
                  {removeMemberMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {member.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{member.fullName}</h3>
                    </div>
                  </div>
                  <Badge variant="outline">{member.role}</Badge>
                  <div className="text-sm text-muted-foreground pt-2 border-t border-border">
                    <b>Project:</b> {member.projectName}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
