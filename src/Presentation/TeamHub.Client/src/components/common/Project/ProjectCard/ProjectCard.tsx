import React from "react";
import { FiMoreHorizontal, FiUsers, FiEdit, FiTrash, FiUserPlus } from "react-icons/fi";
import type { ProjectResponse } from "../../../../models/projects/ProjectResponse";

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
  const completed = project.completed ?? project.completedTasks ?? 0;
  const tasks = project.tasks ?? project.taskCount ?? 0;
  const membersCount = Array.isArray(project.members) ? project.members.length : 0;

  const progress = tasks > 0 ? (completed / tasks) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className={`h-2`} style={{ backgroundColor: project.color }}></div>
      <div className="p-6">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <FiMoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>

        <p className="text-sm text-gray-500 mb-2">
          Created by <span className="font-medium text-gray-700">{project.createdBy}</span>
        </p>

        <p className="text-gray-600 mb-4">{project.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FiUsers className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{membersCount} members</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {completed}/{tasks} tasks
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{ width: `${progress}%`, backgroundColor: project.color }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => onViewBoard(project)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Board
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(project)}
              className="text-gray-400 hover:text-gray-600"
              title="Edit Project"
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="text-gray-400 hover:text-red-600"
              title="Delete Project"
            >
              <FiTrash className="w-4 h-4" />
            </button>
            <button
              onClick={() => onManageMembers(project)}
              className="text-gray-400 hover:text-gray-600"
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
