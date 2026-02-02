"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { projectsApiConnector } from "@/api/projects/project.api";
import { userApiConnector } from "@/api/users/user.api";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { MoreVertical, Pencil, Trash } from "lucide-react";

import type { Project } from "@/schemas/projects/project.schema";

import EditProjectDialog from "./EditProjectDialog";
import RemoveProjectDialog from "./RemoveProjectDialog";

export default function ProjectsGridCard() {
  const queryClient = useQueryClient();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const { data: currentUserData } = useSuspenseQuery({
    queryKey: ["user", "profile"],
    queryFn: userApiConnector.getMyProfile,
  });
  const currentUserId = currentUserData?.id;

  const { data } = useSuspenseQuery({
    queryKey: ["projects", "all"],
    queryFn: projectsApiConnector.getAllProjects,
  });
  const projects = data.data.items;

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Project> }) =>
      projectsApiConnector.updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditingProject(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApiConnector.removeProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setProjectToDelete(null);
    },
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const isOwner = currentUserId && project.createdById === currentUserId;

          return (
            <Card
              key={project.id}
              className="group relative transition-transform transform hover:scale-[1.02] hover:shadow-xl rounded-2xl overflow-hidden bg-card"
            >
              <div
                className="absolute left-0 top-0 h-full w-2 rounded-l-2xl"
                style={{ backgroundColor: project.color }}
              />

              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="pr-4 flex-1">
                    <h3 className="font-semibold text-xl text-card-foreground">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Created by:{" "}
                      <span className="font-medium">
                        {project.createdBy || "Unknown"}
                      </span>
                    </p>
                  </div>

                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-1"
                          aria-label="Project options"
                        >
                          <MoreVertical className="h-5 w-5 text-muted-foreground hover:text-card-foreground" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="z-50">
                        <DropdownMenuItem onClick={() => setEditingProject(project)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setProjectToDelete(project)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <Badge
                    variant={project.isArchived ? "secondary" : "default"}
                    className="capitalize"
                  >
                    {project.isArchived ? "Archived" : "Active"}
                  </Badge>

                  <span className="text-sm text-muted-foreground">
                    {Array.isArray(project.members)
                      ? `${project.members.length} member${
                          project.members.length === 1 ? "" : "s"
                        }`
                      : "0 members"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <EditProjectDialog
        project={editingProject}
        isSaving={updateMutation.isPending}
        onClose={() => setEditingProject(null)}
        onSubmit={({ id, name, description, color }) => {
          updateMutation.mutate({
            id,
            payload: { name, description, color },
          });
        }}
      />

      <RemoveProjectDialog
        open={!!projectToDelete}
        projectName={projectToDelete?.name}
        isDeleting={deleteMutation.isPending}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => {
          if (!projectToDelete) return;
          deleteMutation.mutate(projectToDelete.id);
        }}
      />
    </>
  );
}
