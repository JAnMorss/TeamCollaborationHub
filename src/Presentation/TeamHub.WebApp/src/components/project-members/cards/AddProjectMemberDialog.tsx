"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { userApiConnector } from "@/api/users/user.api";
import { projectsApiConnector } from "@/api/projects/project.api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Plus } from "lucide-react";

export default function AddProjectMemberDialog() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  const { data: projectsResponse } = useSuspenseQuery({
    queryKey: ["projects", "all"],
    queryFn: projectsApiConnector.getAllProjects,
  });

  const projects = projectsResponse?.data?.items || [];

  const { data: usersResponse } = useSuspenseQuery({
    queryKey: ["users", "all"],
    queryFn: () => userApiConnector.getAllUsers(1, 50),
  });

  const users = usersResponse?.items || [];

  const mutation = useMutation({
    mutationFn: (data: { userId: string }) =>
      projectsApiConnector.addProjectMember(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
      setUserId("");
      setProjectId("");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white text-emerald-600 hover:bg-white/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle>Add Project Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full"
            disabled={!userId || !projectId || mutation.isPending}
            onClick={() => mutation.mutate({ userId })}
          >
            {mutation.isPending ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
