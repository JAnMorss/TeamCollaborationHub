"use client";

import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BsPersonCheck, BsPersonX } from "react-icons/bs";
import type { TaskResponse } from "../../../../models/tasks/TaskResponse";

type TaskCardProps = {
  task: TaskResponse;
  currentUserId: string;
  onSelect: (task: TaskResponse) => void;
  onEdit: (task: TaskResponse) => void;
  onAssign: (task: TaskResponse) => void;
  onDelete: (task: TaskResponse) => void;
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  Low: { label: "Low", color: "badge-success" },
  Medium: { label: "Medium", color: "badge-warning" },
  High: { label: "High", color: "badge-error" },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, currentUserId, onSelect, onEdit, onAssign, onDelete }) => {
  const isAssignedToCurrentUser = task.assignedToId === currentUserId;

  return (
    <div
      className={`card bg-base-100 shadow-md hover:shadow-xl p-5 rounded-xl flex flex-col cursor-pointer transition-all duration-300 border border-base-300 ${
        isAssignedToCurrentUser ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100" : ""
      }`}
    >
      <div onClick={() => onSelect(task)} className="flex-1 space-y-3">
        <p className="font-bold text-lg text-base-content break-words line-clamp-2 hover:text-primary transition-colors">
          {task.title}
        </p>
        <p className="text-sm text-base-content/60">
          <span className="font-medium">Created by:</span> {task.createdBy}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="badge badge-outline badge-sm">{task.projectName}</span>
          <span className="badge badge-ghost badge-sm">{task.status}</span>
        </div>
        {task.priority && (
          <div className={`badge ${priorityConfig[task.priority]?.color || "badge-ghost"} badge-sm font-semibold gap-1 inline-flex`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {priorityConfig[task.priority]?.label || task.priority}
          </div>
        )}
        <div className="space-y-1.5 text-sm text-base-content/70 pt-2">
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span className="text-xs">
              {task.assignedTo || <span className="italic text-base-content/40">Unassigned</span>}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-base-300">
        <button
          onClick={() => onEdit(task)}
          className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
        >
          <FiEdit2 size={18} />
        </button>

        <button
          onClick={() => onAssign(task)}
          className={`btn btn-ghost btn-sm btn-square ${task.assignedToId ? 'text-success hover:bg-success/10' : 'hover:bg-base-300'}`}
        >
          {task.assignedToId ? (
            <BsPersonCheck size={18} />
          ) : (
            <BsPersonX size={18} />
          )}
        </button>

        <button
          onClick={() => onDelete(task)}
          className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;