import type { TaskAttachmentResponse } from "./TaskAttachmentResponse";

export interface TaskResponse {
  id: string;
  projectId: string;
  projectName: string;
  createdById: string;
  createdBy: string;
  assignedToId: string | null;
  assignedTo: string | null;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  createdAt: string;
  comments: string;
  attachments: TaskAttachmentResponse[];
  message?: string; 
}
