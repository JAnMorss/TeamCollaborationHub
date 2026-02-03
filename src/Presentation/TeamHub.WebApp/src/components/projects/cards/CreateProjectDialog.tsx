"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateTaskDialogProps {
  projectId: string; // The project where the task will be created
}

export default function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [status, setStatus] = useState<"Todo" | "InProgress" | "Review" | "Completed">("Todo");
  const [dueDate, setDueDate] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (data: any) => tasksApiConnector.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      setTitle("");
      setDescription("");
      setPriority("Low");
      setStatus("Todo");
      setDueDate("");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-white text-blue-600 hover:bg-white/90 hover:text-blue-700 font-semibold transition">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-6 shadow-lg bg-white">
        <DialogHeader className="flex items-center justify-between mb-4">
          <DialogTitle className="text-lg font-semibold">Create Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Title</label>
            <Input
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Description</label>
            <Textarea
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Priority</label>
            <Select value={priority} onValueChange={(val) => setPriority(val as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Status</label>
            <Select value={status} onValueChange={(val) => setStatus(val as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <Button
            className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700 transition-all"
            onClick={() =>
              mutation.mutate({
                projectId,
                title,
                description,
                priority,
                status,
                dueDate: dueDate || null,
              })
            }
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
