"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import type { Task } from "@/schemas/tasks/task.schema";

interface EditTaskDialogProps {
  task: Task;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
}

export default function EditTaskDialog({
  task,
  onClose,
  onSubmit,
}: EditTaskDialogProps) {
  type StatusType = Task["status"];
  type PriorityType = Task["priority"];

  const [form, setForm] = useState<{
    title: string;
    description: string;
    status: StatusType;
    priority: PriorityType;
    dueDate: string;
  }>({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority || "Medium",
    dueDate: task.dueDate || "",
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Edit the details of this task</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm({ ...form, status: value as StatusType })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todo">To Do</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(value) =>
                setForm({ ...form, priority: value as PriorityType })
              }
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />
          </div>

          <Button
            onClick={() => onSubmit(form)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Update Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
