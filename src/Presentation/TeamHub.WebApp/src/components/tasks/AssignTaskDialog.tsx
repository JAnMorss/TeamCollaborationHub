"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApiConnector } from "@/api/users/user.api";
import { tasksApiConnector } from "@/api/tasks/tasks.api";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import type { Task } from "@/schemas/tasks/task.schema";
import type { User } from "@/schemas/users/user.schema";

interface AssignTaskDialogProps {
  task: Task;
  onClose: () => void;
}

interface GetAllUsersResponse {
  items: User[];
  totalCount: number;
}

export default function AssignTaskDialog({ task, onClose }: AssignTaskDialogProps) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState("");

  const { data: usersData, isLoading, isError } = useQuery<GetAllUsersResponse>({
    queryKey: ["users", "all"],
    queryFn: async () => {
      const res = await userApiConnector.getAllUsers(1, 50);
      return res;
    },
  });

  const users = usersData?.items || [];

  const assignTaskMutation = useMutation({
    mutationFn: (userId: string) =>
      tasksApiConnector.assignTask(task.id, { assignedTo: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task: {task.title}</DialogTitle>
        </DialogHeader>

        {isLoading && <p className="text-sm text-muted-foreground">Loading users...</p>}
        {isError && <p className="text-sm text-destructive">Failed to load users.</p>}

        {!isLoading && !isError && (
          <Select value={selectedUser} onValueChange={setSelectedUser}>
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
        )}

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!selectedUser || assignTaskMutation.isPending}
            onClick={() => assignTaskMutation.mutate(selectedUser)}
          >
            {assignTaskMutation.isPending ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
