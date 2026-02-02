"use client";

import { useState } from "react";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash, Paperclip, X } from "lucide-react";
import EditTaskDialog from "./EditTaskDialog";
import RemoveTaskDialog from "./RemoveTaskDialog";
import UploadAttachmentDialog from "./UploadAttachmentDialog";
import RemoveTaskAttachmentDialog from "./RemoveTaskAttachmentDialog";
import AssignTaskDialog from "./AssignTaskDialog"; 
import type { Task, TaskAttachment } from "@/schemas/tasks/task.schema";

export default function TasksGridCard() {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [uploadingTask, setUploadingTask] = useState<Task | null>(null);
  const [removingAttachment, setRemovingAttachment] = useState<{ task: Task; attachmentId: string } | null>(null);
  const [assigningTask, setAssigningTask] = useState<Task | null>(null);

  const { data: tasksData } = useSuspenseQuery({
    queryKey: ["tasks", "all"],
    queryFn: tasksApiConnector.getAllTasks,
  });

  const tasks = tasksData.data.items;

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) =>
      tasksApiConnector.updateTask(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksApiConnector.deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const getStatusBadge = (status: Task["status"]) => {
    const configs: Record<Task["status"], { class: string; label: string }> = {
      Todo: { class: "bg-gray-100 text-gray-700", label: "To Do" },
      InProgress: { class: "bg-blue-100 text-blue-700", label: "In Progress" },
      Review: { class: "bg-yellow-100 text-yellow-700", label: "Review" },
      Completed: { class: "bg-green-100 text-green-700", label: "Completed" },
    };
    return <Badge className={configs[status].class}>{configs[status].label}</Badge>;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const attachments = Array.isArray(task.attachments) ? task.attachments : [];
          return (
            <Card key={task.id} className="group relative transition-transform transform hover:scale-[1.02] hover:shadow-xl rounded-2xl overflow-hidden bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="pr-4 flex-1">
                    <h3 className="font-semibold text-xl text-card-foreground">{task.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Created by: <span className="font-medium">{task.createdBy || "Unknown"}</span>
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="p-1">
                        <MoreVertical className="h-5 w-5 text-muted-foreground hover:text-card-foreground" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="z-50">
                      <DropdownMenuItem onClick={() => setEditingTask(task)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => setUploadingTask(task)}>
                        <Paperclip className="mr-2 h-4 w-4" /> Upload Attachment
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => setAssigningTask(task)}>
                        <Paperclip className="mr-2 h-4 w-4" /> Assign Task
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setTaskToDelete(task)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>

                <div className="flex justify-between items-center pt-3 border-t border-border">
                  {getStatusBadge(task.status)}
                  <span className="text-sm text-muted-foreground">
                    {task.assignedTo || "Unassigned"}
                  </span>
                </div>

                {attachments.length > 0 && (
                  <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
                    {attachments.map((att: TaskAttachment) => (
                      <div key={att.id} className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Paperclip className="w-4 h-4" /> {att.fileName}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-1"
                          onClick={() => setRemovingAttachment({ task, attachmentId: att.id })}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(payload) => updateMutation.mutate({ id: editingTask.id, payload })}
        />
      )}

      {taskToDelete && (
        <RemoveTaskDialog
          taskName={taskToDelete.title}
          isDeleting={deleteMutation.isPending}
          onClose={() => setTaskToDelete(null)}
          onConfirm={() => deleteMutation.mutate(taskToDelete.id)}
        />
      )}

      {uploadingTask && (
        <UploadAttachmentDialog
          task={uploadingTask}
          onClose={() => setUploadingTask(null)}
        />
      )}

      {removingAttachment && (
        <RemoveTaskAttachmentDialog
          attachmentId={removingAttachment.attachmentId}
          onClose={() => setRemovingAttachment(null)}
        />
      )}

      {assigningTask && (
        <AssignTaskDialog
          task={assigningTask}
          onClose={() => setAssigningTask(null)}
        />
      )}
    </>
  );
}
