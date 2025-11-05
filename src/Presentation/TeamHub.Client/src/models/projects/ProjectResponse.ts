import type { ProjectMemberResponse } from "./ProjectMemberResponse";

export interface ProjectResponse {
  completedTasks: number;
  taskCount: number;
  tasks: number;
  completed: number;
  id: string;
  createdById: string;
  createdBy: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  isArchived: boolean;
  updatedAt: string | null;
  members: ProjectMemberResponse[] | string; 
}
