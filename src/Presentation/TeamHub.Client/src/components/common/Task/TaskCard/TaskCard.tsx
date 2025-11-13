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
  Low: { label: "Low", color: "bg-green-200 text-green-800" },
  Medium: { label: "Medium", color: "bg-yellow-200 text-yellow-800" },
  High: { label: "High", color: "bg-red-200 text-red-800" },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, currentUserId, onSelect, onEdit, onAssign, onDelete }) => {
  const isAssignedToCurrentUser = task.assignedToId === currentUserId;

  return (
    <div
      className={`card bg-base-100 shadow-lg p-4 rounded-xl flex flex-col cursor-pointer hover:shadow-xl transition-all duration-200 ${
        isAssignedToCurrentUser ? "border-2 border-blue-400" : ""
      }`}
    >
      <div onClick={() => onSelect(task)} className="flex-1">
        <p className="font-semibold text-slate-900 dark:text-white break-words line-clamp-2">
          {task.title}
        </p>
        {task.priority && (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
              priorityConfig[task.priority]?.color || "bg-gray-200 text-gray-800"
            }`}
          >
            {priorityConfig[task.priority]?.label || task.priority}
          </span>
        )}
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          {task.dueDate && <div>📅 {new Date(task.dueDate).toLocaleDateString()}</div>}
          <div>
            👤 {task.assignedTo || <span className="italic text-slate-400">Unassigned</span>}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          <FiEdit2 size={18} />
        </button>

        <button
          onClick={() => onAssign(task)}
          className="p-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
        >
          {task.assignedToId ? (
            <BsPersonCheck size={18} className="text-emerald-500" />
          ) : (
            <BsPersonX size={18} />
          )}
        </button>

        <button
          onClick={() => onDelete(task)}
          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
