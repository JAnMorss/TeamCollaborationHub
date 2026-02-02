"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApiConnector } from "@/api/projects/project.api";
import { userApiConnector } from "@/api/users/user.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectMember, Project } from "@/schemas/projects/project.schema";
import { RemoveProjectMemberDialog } from "./RemoveProjectMemberDialog";

export default function ProjectMembersGridCard() {
  const [memberToRemove, setMemberToRemove] = useState<{ projectId: string; userId: string; fullName: string } | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project-members"],
    queryFn: () => projectsApiConnector.getAllProjects(),
  });

  const { data: currentUserData } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: userApiConnector.getMyProfile,
  });
  const currentUserId = currentUserData?.id;

  const projects: Project[] = data?.data.items ?? [];

  const membersByProject = projects.reduce((acc, project) => {
    if (Array.isArray(project.members)) {
      acc[project.id] = {
        projectName: project.name,
        projectId: project.id,
        createdBy: project.createdBy || "Unknown",
        createdById: project.createdById,
        members: project.members.map((member) => ({
          ...member,
          projectName: project.name,
          projectId: project.id,
          addedBy: project.createdBy || "Unknown",
          createdById: project.createdById,
        })),
      };
    }
    return acc;
  }, {} as Record<string, { projectName: string; projectId: string; createdBy: string; createdById: string; members: (ProjectMember & { projectName: string; projectId: string; addedBy: string; createdById: string })[] }>);

  const totalMembers = Object.values(membersByProject).reduce((sum, proj) => sum + proj.members.length, 0);

  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectsApiConnector.removeProjectMember(projectId, userId),
    onMutate: async ({ projectId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ["project-members"] });

      const previousProjects = queryClient.getQueryData(["project-members"]);

      queryClient.setQueryData(["project-members"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((project: Project) => {
              if (project.id === projectId && Array.isArray(project.members)) {
                return {
                  ...project,
                  members: project.members.filter((member: ProjectMember) => member.userId !== userId),
                };
              }
              return project;
            }),
          },
        };
      });

      return { previousProjects };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(["project-members"], context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
    },
  });

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Project Members
        </CardTitle>
        <Badge variant="secondary">{totalMembers}</Badge>
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
        ) : totalMembers === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-10">
            No members found
          </p>
        ) : (
          <div className="space-y-8">
            {Object.values(membersByProject).map((projectData) => (
              <div key={projectData.projectId} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{projectData.projectName}</h3>
                  <Badge variant="outline">{projectData.members.length} members</Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projectData.members.map((member) => {
                    const canRemove = currentUserId && member.createdById === currentUserId;

                    return (
                      <Card
                        key={member.id}
                        className="group relative transition-transform transform hover:scale-[1.02] hover:shadow-xl rounded-2xl overflow-hidden bg-card p-6"
                      >
                        {canRemove && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                            aria-label="Remove member"
                            onClick={() => setMemberToRemove({ projectId: member.projectId, userId: member.userId, fullName: member.fullName })}
                          >
                            {removeMemberMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        )}
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
                          <div className="text-sm text-muted-foreground">
                            <b>Added by:</b> {member.addedBy}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <RemoveProjectMemberDialog
        open={!!memberToRemove}
        member={memberToRemove}
        isLoading={removeMemberMutation.isPending}
        onClose={() => setMemberToRemove(null)}
        onConfirm={(payload) => {
          removeMemberMutation.mutate({
            projectId: payload.projectId,
            userId: payload.userId,
          });
          setMemberToRemove(null);
        }}
      />
    </Card>
  );
}
