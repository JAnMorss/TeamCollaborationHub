"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { projectsApiConnector } from "@/api/projects/project.api";
import { tasksApiConnector } from "@/api/tasks/tasks.api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { Task } from "@/schemas/tasks/task.schema";
import type { ProjectMember } from "@/schemas/projects/project.schema";

interface AssignTaskDialogProps {
  task: Task;
  onClose: () => void;
}

export default function AssignTaskDialog({
  task,
  onClose,
}: AssignTaskDialogProps) {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project-members", task.projectId],
    queryFn: () =>
      projectsApiConnector.getAllMembersOfProject(task.projectId),
  });

  const members: ProjectMember[] = data?.data.items ?? [];

  const assignTaskMutation = useMutation({
    mutationFn: (userId: string) =>
      tasksApiConnector.assignTask(task.id, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task: {task.title}</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Loading project members...
          </p>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Failed to load project members.
          </p>
        )}

        {!isLoading && !isError && (
          <Select
            value={selectedUserId}
            onValueChange={setSelectedUserId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project member" />
            </SelectTrigger>

            <SelectContent>
              {members.map((member) => (
                <SelectItem
                  key={member.userId}
                  value={member.userId}
                >
                  {member.fullName} • {member.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={!selectedUserId || assignTaskMutation.isPending}
            onClick={() =>
              assignTaskMutation.mutate(selectedUserId)
            }
          >
            {assignTaskMutation.isPending
              ? "Assigning..."
              : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
