"use client";

import { useState, type JSX } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Pencil,
  Trash,
  Paperclip,
  X,
  Folder,
  Download,
} from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"; // <- ShadCN pagination imports

import EditTaskDialog from "./EditTaskDialog";
import RemoveTaskDialog from "./RemoveTaskDialog";
import UploadAttachmentDialog from "./UploadAttachmentDialog";
import RemoveTaskAttachmentDialog from "./RemoveTaskAttachmentDialog";
import AssignTaskDialog from "./AssignTaskDialog";
import UnassignTaskDialog from "./UnassignTaskDialog";
import DownloadTaskAttachmentDialog from "./DownloadTaskAttachmentDialog";

import type { Task, TaskAttachment } from "@/schemas/tasks/task.schema";

export default function TasksGridCard() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(6); 

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [uploadingTask, setUploadingTask] = useState<Task | null>(null);
  const [removingAttachment, setRemovingAttachment] = useState<{
    task: Task;
    attachmentId: string;
  } | null>(null);
  const [downloadingAttachment, setDownloadingAttachment] = useState<{
    attachmentId: string;
    fileName: string;
  } | null>(null);
  const [assigningTask, setAssigningTask] = useState<Task | null>(null);
  const [unassigningTask, setUnassigningTask] = useState<Task | null>(null);

  const { data: tasksData } = useSuspenseQuery({
    queryKey: ["tasks", "all"],
    queryFn: tasksApiConnector.getAllTasks,
  });

  const tasks = tasksData.data.items;

  const totalPages = Math.ceil(tasks.length / pageSize);
  const paginatedTasks = tasks.slice((page - 1) * pageSize, page * pageSize);

  const statusBadgeConfig: Record<
    Task["status"],
    { bg: string; text: string; label: string }
  > = {
    Todo: { bg: "bg-gray-200 dark:bg-gray-700", text: "text-gray-800 dark:text-gray-200", label: "To Do" },
    InProgress: { bg: "bg-blue-200 dark:bg-blue-700", text: "text-blue-800 dark:text-blue-200", label: "In Progress" },
    Review: { bg: "bg-yellow-200 dark:bg-yellow-700", text: "text-yellow-800 dark:text-yellow-200", label: "Review" },
    Completed: { bg: "bg-green-200 dark:bg-green-700", text: "text-green-800 dark:text-green-200", label: "Completed" },
  };

  function getStatusBadge(status: Task["status"]) {
    const { bg, text, label } = statusBadgeConfig[status];
    return (
      <Badge className={`${bg} ${text} font-semibold px-3 py-1 rounded-full select-none`}>
        {label}
      </Badge>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTasks.map((task) => {
          const attachments = Array.isArray(task.attachments) ? task.attachments : [];
          const projectName =
            (task as any).projectName || (task as any).project?.name || "No Project";

          return (
            <Card
              key={task.id}
              className="group relative transition-transform hover:scale-[1.03] hover:shadow-lg rounded-2xl overflow-hidden bg-card border border-border"
            >
              <CardContent className="p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="pr-4 flex-1 space-y-1">
                      <h3 className="font-semibold text-xl text-card-foreground truncate">
                        {task.title}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Folder className="h-4 w-4" />
                        <span className="truncate">{projectName}</span>
                      </div>

                      <p className="text-xs text-muted-foreground italic truncate">
                        Created by:{" "}
                        <span className="font-medium">
                          {task.createdBy || "Unknown"}
                        </span>
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Task options"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="z-50 rounded-md shadow-lg bg-popover border border-border">
                        <DropdownMenuItem onClick={() => setEditingTask(task)} className="hover:bg-primary/10">
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setUploadingTask(task)} className="hover:bg-primary/10">
                          <Paperclip className="mr-2 h-4 w-4" /> Upload Attachment
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setAssigningTask(task)} className="hover:bg-primary/10">
                          <Paperclip className="mr-2 h-4 w-4" /> Assign Task
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setUnassigningTask(task)}
                          disabled={!task.assignedTo}
                          className="disabled:opacity-40 disabled:pointer-events-none hover:bg-primary/10"
                        >
                          <X className="mr-2 h-4 w-4" /> Unassign Task
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setTaskToDelete(task)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
                    {task.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-border gap-2">
                  {getStatusBadge(task.status)}
                  <span className="text-sm text-muted-foreground truncate max-w-full sm:max-w-xs">
                    {task.assignedTo || "Unassigned"}
                  </span>
                </div>

                {attachments.length > 0 && (
                  <div className="flex flex-col gap-1 pt-4 border-t border-border max-h-36 overflow-auto">
                    {attachments.map((att: TaskAttachment) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between text-sm text-muted-foreground"
                      >
                        <span className="flex items-center gap-1 truncate">
                          <Paperclip className="w-4 h-4" />
                          <span className="truncate">{att.fileName}</span>
                        </span>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-1 text-blue-500 hover:text-blue-600"
                            onClick={() =>
                              setDownloadingAttachment({
                                attachmentId: att.id,
                                fileName: att.fileName,
                              })
                            }
                            aria-label={`Download attachment ${att.fileName}`}
                          >
                            <Download className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-1 text-red-500 hover:text-red-600"
                            onClick={() =>
                              setRemovingAttachment({
                                task,
                                attachmentId: att.id,
                              })
                            }
                            aria-label={`Remove attachment ${att.fileName}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* --- Pagination with Ellipsis --- */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationPrevious
            onClick={() => page > 1 && setPage(page - 1)}
            className={page === 1 ? "pointer-events-none opacity-40" : ""}
          />

          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .map((p) => {
                
                if (
                  p === 1 ||
                  p === totalPages ||
                  (p >= page - 1 && p <= page + 1)
                ) {
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })
              .reduce<JSX.Element[]>((acc, el, idx) => {
                if (!el) return acc;

                const last = acc[acc.length - 1];
                if (last && Number(last.props.children) + 1 < Number(el.props.children)) {
                  acc.push(
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationLink isActive={false} className="pointer-events-none">
                        ...
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                acc.push(el);
                return acc;
              }, [])}
          </PaginationContent>

          <PaginationNext
            onClick={() => page < totalPages && setPage(page + 1)}
            className={page === totalPages ? "pointer-events-none opacity-40" : ""}
          />
        </Pagination>
      </div>


      {editingTask && (
        <EditTaskDialog
          open={!!editingTask}
          task={editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
        />
      )}

      {taskToDelete && (
        <RemoveTaskDialog
          open={!!taskToDelete}
          taskId={taskToDelete.id}
          taskName={taskToDelete.title}
          onClose={() => setTaskToDelete(null)}
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

      {downloadingAttachment && (
        <DownloadTaskAttachmentDialog
          attachmentId={downloadingAttachment.attachmentId}
          fileName={downloadingAttachment.fileName}
          onClose={() => setDownloadingAttachment(null)}
        />
      )}

      {assigningTask && (
        <AssignTaskDialog
          task={assigningTask}
          onClose={() => setAssigningTask(null)}
        />
      )}

      {unassigningTask && (
        <UnassignTaskDialog
          open={!!unassigningTask}
          taskId={unassigningTask.id}
          assigneeName={unassigningTask.assignedTo ?? undefined}
          onOpenChange={(open) => !open && setUnassigningTask(null)}
          onUnassigned={() => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            setUnassigningTask(null);
          }}
        />
      )}
    </>
  );
}
