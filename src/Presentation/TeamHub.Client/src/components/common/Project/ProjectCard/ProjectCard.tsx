import React, { useEffect, useState } from "react";
import { FiMoreHorizontal, FiUsers, FiEdit, FiTrash, FiUserPlus } from "react-icons/fi";
import type { ProjectResponse } from "../../../../models/projects/ProjectResponse";
import type { TaskResponse } from "../../../../models/tasks/TaskResponse";
import { getTasksByProjectId } from "../../../../services/api/taskApiConnector";

interface ProjectCardProps {
  project: ProjectResponse & { completed?: number; tasks?: number };
  onViewBoard: (project: ProjectResponse) => void;
  onEdit: (project: ProjectResponse) => void; 
  onDelete: (projectId: string) => void; 
  onManageMembers: (project: ProjectResponse) => void; 
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onViewBoard, 
  onEdit, 
  onDelete, 
  onManageMembers 
}) => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTasks = async () => {
      try {
        const taskList = await getTasksByProjectId(project.id);
        if (mounted) setTasks(taskList);
      } catch (error) {
        console.error("Failed to load tasks for project", project.id, error);
      } finally {
        if (mounted) setLoadingTasks(false);
      }
    };

    fetchTasks();

    return () => { mounted = false };
  }, [project.id]);

  const completed = tasks.filter(task => task.status === "COMPLETED").length;
  const totalTasks = tasks.length;
  const membersCount = Array.isArray(project.members) ? project.members.length : 0;

  const progress = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  return (
    <div className="card project-card rounded-xl border border-gray-200 overflow-hidden">
      <div className={`h-2`} style={{ backgroundColor: project.color }}></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-theme">{project.name}</h3>
          <FiMoreHorizontal className="w-5 h-5 icon-muted cursor-pointer" />
        </div>

        <p className="text-sm text-muted mb-2">
          Created by <span className="font-medium text-theme">{project.createdBy}</span>
        </p>

        <p className="text-muted mb-4">{project.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FiUsers className="w-4 h-4 icon-muted" />
            <span className="text-sm text-muted">{membersCount} members</span>
          </div>
          <div className="flex items-center space-x-2">
            {loadingTasks ? (
              <span className="text-sm text-muted">Loading tasks...</span>
            ) : (
              <span className="text-sm text-muted">
                {completed}/{totalTasks} tasks
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Progress</span>
            <span className="text-sm font-medium text-theme">
              {loadingTasks ? "0%" : `${Math.round(progress)}%`}
            </span>
          </div>
          <div className="track rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{ width: `${progress}%`, backgroundColor: project.color }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => onViewBoard(project)}
            className="text-accent hover:opacity-90 font-medium text-sm"
          >
            View Board
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(project)}
              className="icon-muted hover:text-theme"
              title="Edit Project"
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="icon-muted hover:text-red-600"
              title="Delete Project"
            >
              <FiTrash className="w-4 h-4" />
            </button>
            <button
              onClick={() => onManageMembers(project)}
              className="icon-muted hover:text-theme"
              title="Manage Members"
            >
              <FiUserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
