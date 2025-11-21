"use client";

import React, { useEffect, useState } from "react";
import TaskCard from "../../components/common/Task/TaskCard/TaskCard";
import TaskModal from "../../components/common/Task/TaskModal/TaskModal";
import TaskAssigneeModal from "../../components/common/Task/TaskAssigneeModal/TaskAssigneeModal";
import UpdateTaskModal from "../../components/common/Task/UpdateTaskModal/UpdateTaskModal";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import {
  getAllTasks,
  deleteTask,
  assignTask,
  unassignTask,
  updateTask,
} from "../../services/api/taskApiConnector";
import { getMyProfile } from "../../services/api/userApiConnector";
import type { TaskResponse } from "../../models/tasks/TaskResponse";
import type { TaskRequest } from "../../models/tasks/TaskRequest";

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [assigneeTask, setAssigneeTask] = useState<TaskResponse | null>(null);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskResponse | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const tasksFromApi = await getAllTasks();
      const normalized = tasksFromApi.map((task) => ({
        ...task,
        attachments: Array.isArray(task.attachments) ? task.attachments : [],
      }));
      setTasks(normalized);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setErrorMessage("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getMyProfile();
        setCurrentUserId(profile.id);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setErrorMessage("Failed to load user profile.");
      }
      await fetchTasks();
    };
    load();
  }, []);

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(undefined);
        setSuccessMessage(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const handleUpdateTask = async (id: string, task: TaskRequest) => {
    try {
      const updated = await updateTask(id, task);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...updated, attachments: t.attachments } : t)));
      setSuccessMessage("Task updated successfully!");
      setShowEditModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to update task:", err);
      setErrorMessage("Failed to update task.");
    }
  };

  const requestDeleteTask = (task: TaskResponse) => {
    setTaskToDelete(task);
    setShowConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setSuccessMessage("Task deleted successfully!");
    } catch (err) {
      console.error("Failed to delete task:", err);
      setErrorMessage("Failed to delete task.");
    } finally {
      setShowConfirmModal(false);
      setTaskToDelete(null);
    }
  };

  const handleAssign = async (task: TaskResponse, userId: string) => {
    try {
      const updated = await assignTask(task.id, { userId });
      if (updated?.id) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === updated.id
              ? { ...t, assignedToId: updated.assignedToId, assignedTo: updated.assignedTo }
              : t
          )
        );
        setSuccessMessage("Task assigned successfully!");
        setAssigneeTask(null);
      } else {
        await fetchTasks();
      }
    } catch (err: any) {
      console.error("Failed to assign task:", err);
      const msg = err?.response?.data?.detail || "An error occurred while assigning the task.";
      setErrorMessage(msg);
    }
  };

  const handleUnassign = async (task: TaskResponse) => {
    try {
      const updated = await unassignTask(task.id);
      if (updated?.id) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === updated.id ? { ...t, assignedToId: null, assignedTo: null } : t
          )
        );
        setSuccessMessage("Task unassigned successfully!");
        setAssigneeTask(null);
      } else {
        await fetchTasks();
      }
    } catch (err: any) {
      console.error("Failed to unassign task:", err);
      const msg = err?.response?.data?.detail || "An error occurred while unassigning the task.";
      setErrorMessage(msg);
    }
  };

  const handleTaskModalClose = async () => {
    if (selectedTask) {
      await fetchTasks();
    }
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen page-bg p-6">
      {(successMessage || errorMessage) && (
        <div className="toast toast-top toast-end z-50">
          {successMessage && (
            <div className="alert alert-success shadow-lg">
              <span>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-error shadow-lg">
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      <div className="mb-8 animate-fade-in">
        <h1 className="task-title text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
          All Tasks
        </h1>
        <p className="task-subtitle text-slate-600 dark:text-slate-400 text-lg">
          View and manage your tasks
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            No tasks available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <TaskCard
                task={task}
                currentUserId={currentUserId || ""}
                onSelect={(t) => setSelectedTask(t)}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowEditModal(true);
                }}
                onAssign={(t) => setAssigneeTask(t)}
                onDelete={(t) => requestDeleteTask(t)}
              />
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        show={showConfirmModal}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title || "this task"}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteTask}
        onCancel={() => {
          setShowConfirmModal(false);
          setTaskToDelete(null);
        }}
      />

      {selectedTask && (
        <TaskModal 
          show={true} 
          task={selectedTask} 
          onClose={handleTaskModalClose}
        />
      )}

      {assigneeTask && (
        <TaskAssigneeModal
          show={!!assigneeTask}
          task={assigneeTask}
          onClose={() => {
            setAssigneeTask(null);
            setSuccessMessage(undefined);
            setErrorMessage(undefined);
          }}
          onAssign={(userId) => assigneeTask && handleAssign(assigneeTask, userId)}
          onUnassign={() => assigneeTask && handleUnassign(assigneeTask)}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      )}

      <UpdateTaskModal
        show={showEditModal}
        task={editingTask}
        projectId="general"
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
};

export default TaskPage;