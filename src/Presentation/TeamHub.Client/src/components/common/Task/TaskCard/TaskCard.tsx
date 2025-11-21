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

const priorityConfig: Record<string, { label: string; color: string; hex: string }> = {
  Low: { label: "Low", color: "badge-success", hex: "#10b981" },
  Medium: { label: "Medium", color: "badge-warning", hex: "#f59e0b" },
  High: { label: "High", color: "badge-error", hex: "#ef4444" },
};

function hexToRgba(hex: string, alpha = 0.12) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, currentUserId, onSelect, onEdit, onAssign, onDelete }) => {
  const isAssignedToCurrentUser = task.assignedToId === currentUserId;

  return (
    <div
      className={`card card-hover p-5 rounded-xl flex flex-col cursor-pointer transition-all duration-300 border border-theme ${
        isAssignedToCurrentUser ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
    >
      <div onClick={() => onSelect(task)} className="flex-1 space-y-3">
        <p className="font-bold text-lg text-theme break-words line-clamp-2 hover:text-accent transition-colors">
          {task.title}
        </p>
        <p className="text-sm text-muted">
          <span className="font-medium text-theme">Created by:</span> {task.createdBy}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="badge badge-outline badge-sm">{task.projectName}</span>
          <span className="badge badge-ghost badge-sm">{task.status}</span>
        </div>
        {task.priority && (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold task-priority-pill"
            style={{
              backgroundColor: hexToRgba(priorityConfig[task.priority]?.hex || '#9ca3af', 0.12),
              color: priorityConfig[task.priority]?.hex || '#9ca3af',
            }}
          >
            {priorityConfig[task.priority]?.label || task.priority}
          </div>
        )}
        <div className="space-y-1.5 text-sm text-muted pt-2">
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span className="text-xs">
              {task.assignedTo || <span className="italic text-muted">Unassigned</span>}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-theme">
        <button
          onClick={() => onEdit(task)}
          className="btn btn-ghost btn-sm btn-square text-info hover:bg-info/10"
        >
          <FiEdit2 size={18} />
        </button>

        <button
          onClick={() => onAssign(task)}
          className={`btn btn-ghost btn-sm btn-square ${task.assignedToId ? 'text-success hover:bg-success/10' : 'hover:bg-base-100'}`}
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