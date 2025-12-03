"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi"
import { BsPersonCheck, BsPersonX } from "react-icons/bs"
import type { TaskResponse } from "../../models/tasks/TaskResponse"
import type { TaskRequest } from "../../models/tasks/TaskRequest"
import {
  getTasksByProjectId,
  createTask,
  updateTask,
  assignTask,
  unassignTask,
  deleteTask,
} from "../../services/api/taskApiConnector"
import TaskModal from "../../components/common/Task/TaskModal/TaskModal"
import TaskAssigneeModal from "../../components/common/Task/TaskAssigneeModal/TaskAssigneeModal"
import TaskFormModal from "../../components/common/Task/TaskFormModal/TaskFormModal"
import UpdateTaskModal from "../../components/common/Task/UpdateTaskModal/UpdateTaskModal"
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal"

type KanbanBoardProps = {
  projectId: string
  projectName: string
  currentUserId: string
  onBack: () => void
}

type TaskStatus = "Todo" | "InProgress" | "Review" | "Completed"

const statusConfig: Record<TaskStatus, { color: string; badge: string; header: string }> = {
  Todo: {
    color: "from-slate-500 to-slate-600",
    badge: "badge-secondary",
    header: "bg-secondary/10",
  },
  InProgress: {
    color: "from-blue-500 to-blue-600",
    badge: "badge-info",
    header: "bg-info/10",
  },
  Review: {
    color: "from-amber-500 to-amber-600",
    badge: "badge-warning",
    header: "bg-warning/10",
  },
  Completed: {
    color: "from-emerald-500 to-emerald-600",
    badge: "badge-success",
    header: "bg-success/10",
  },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  Low: { label: "Low", color: "bg-green-200 text-green-800" },
  Medium: { label: "Medium", color: "bg-yellow-200 text-yellow-800" },
  High: { label: "High", color: "bg-red-200 text-red-800" },
};


const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, projectName, onBack }) => {
  const [tasks, setTasks] = useState<TaskResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null)
  const [assigneeTask, setAssigneeTask] = useState<TaskResponse | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<TaskResponse | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null) 
  const [showEditModal, setShowEditModal] = useState(false) 

  const statuses: TaskStatus[] = ["Todo", "InProgress", "Review", "Completed"]


  const fetchTasks = async () => {
    setLoading(true)
    try {
      const data = await getTasksByProjectId(projectId)
      setTasks(data)
    } catch (err) {
      console.error("Failed to fetch tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const handleCreateTask = async (task: TaskRequest) => {
    try {
      const created = await createTask(task)
      setTasks((prev) => [...prev, created])
      setSuccessMessage("Task created successfully!")
    } catch (err) {
      console.error("Failed to create task:", err)
      setErrorMessage("Failed to create task. Check required fields.")
    }
  }

  const handleUpdateTask = async (id: string, task: TaskRequest) => {
    try {
      const updated = await updateTask(id, task)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      setSuccessMessage("Task updated successfully!")
      setShowEditModal(false)
      setEditingTask(null)
    } catch (err) {
      console.error("Failed to update task:", err)
      setErrorMessage("Failed to update task. Check required fields.")
    }
  }

  const requestDeleteTask = (task: TaskResponse) => {
    setTaskToDelete(task)
    setShowConfirmModal(true)
  }

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return
    try {
      await deleteTask(taskToDelete.id)
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id))
      setSuccessMessage("Task deleted successfully!")
    } catch (err) {
      console.error("Failed to delete task:", err)
      setErrorMessage("Failed to delete task.")
    } finally {
      setShowConfirmModal(false)
      setTaskToDelete(null)
    }
  }

  const handleAssign = async (task: TaskResponse, userId: string) => {
    if (task.assignedToId === userId) {
      setErrorMessage("This task is already assigned to this user.");
      return;
    }

    try {
      const payload = { userId };
      console.log("Assign payload:", payload);

      const updated = await assignTask(task.id, payload);

      console.log("Updated task from API:", updated);

      if (!updated || !updated.id) {
        console.error("Invalid response from assignTask API");
        await fetchTasks();
        setAssigneeTask(null);
        return;
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.id === updated.id
            ? {
                ...t,
                assignedToId: updated.assignedToId,
                assignedTo: updated.assignedTo,
              }
            : t
        )
      );
      
      setSuccessMessage("Task assigned successfully!");

    } catch (err: any) {
      console.error("Failed to assign task:", err);
      const errorMessage = err?.response?.data?.detail || "An error occurred while assigning the task.";
      setErrorMessage(errorMessage);
      await fetchTasks();
    }
  };

  const handleUnassign = async (task: TaskResponse) => {
    try {
      const updated = await unassignTask(task.id);

      console.log("Updated task from API:", updated);

      if (!updated || !updated.id) {
        console.error("Invalid response from unassignTask API");
        await fetchTasks();
        setAssigneeTask(null);
        return;
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.id === updated.id
            ? {
                ...t,
                assignedToId: null,
                assignedTo: null,
              }
            : t
        )
      );
      
      setSuccessMessage("Task unassigned successfully!");

    } catch (err: any) {
      console.error("Failed to unassign task:", err);
      const errorMessage = err?.response?.data?.detail || "An error occurred while unassigning the task.";
      setErrorMessage(errorMessage);
      await fetchTasks();
    }
  };

  return (
    <div className="min-h-screen page-bg p-6">

      <div className="mb-8 animate-fade-in">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
              {projectName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Manage tasks visually on your board</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary gap-2">
              <FiPlus /> New Task
            </button>
            <button
              onClick={onBack}
              className="btn btn-ghost gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {statuses.map((status, index) => (
          <div key={status} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`${statusConfig[status].header} rounded-t-xl p-4 border-b-4`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-base text-theme dark:text-white px-2">{status}</h3>
                  <span className={`badge ${statusConfig[status].badge} badge-sm px-2`}>
                    {tasks.filter((t) => t.status === status).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg rounded-b-xl h-[65vh] flex flex-col border border-t-0">
              <div className="flex-1 overflow-y-auto space-y-3 p-4">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task, taskIndex) => (
                    <div
                      key={task.id}
                      className="card bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 shadow-sm hover:shadow-xl hover:scale-102 cursor-pointer flex justify-between items-start gap-3 p-4 transition-all duration-300 border border-slate-200 dark:border-slate-600 animate-slide-up"
                      style={{ animationDelay: `${taskIndex * 50}ms` }}
                    >
                      <div onClick={() => setSelectedTask(task)} className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white break-words line-clamp-2">
                          {task.title}
                        </p>

                        <div className="mt-1">
                          {task.priority && (
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                priorityConfig[task.priority]?.color || "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {priorityConfig[task.priority]?.label || task.priority}
                            </span>
                          )}
                        </div>
                      
                        <div className="mt-3 space-y-2">
                          {task.dueDate && (
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <span>📅</span>
                              <span>
                                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs">
                            {task.assignedTo ? (
                              <>
                                <span>👤</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  {task.assignedTo}
                                </span>
                              </>
                            ) : (
                              <span className="text-slate-500 dark:text-slate-400 italic">Unassigned</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTask(task)
                            setShowEditModal(true)
                          }}
                          className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                          title="Edit Task"
                        >
                          <FiEdit2 size={18} />
                        </button>

                        <button
                          onClick={() => setAssigneeTask(task)}
                          className="p-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
                          title="Assign / Unassign Task"
                        >
                          {task.assignedToId ? (
                            <BsPersonCheck size={18} className="text-emerald-500 " />
                          ) : (
                            <BsPersonX size={18} />
                          )}
                        </button>

                        <button
                          onClick={() => requestDeleteTask(task)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-700 transition-colors duration-200"
                          title="Delete Task"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        show={showConfirmModal}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title || "this task"}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteTask}
        onCancel={() => {
          setShowConfirmModal(false)
          setTaskToDelete(null)
        }}
      />

      {selectedTask && <TaskModal show={true} task={selectedTask} onClose={() => setSelectedTask(null)} />}

      {assigneeTask && (
        <TaskAssigneeModal
          show={!!assigneeTask}
          task={assigneeTask}
          onClose={() => {
            setAssigneeTask(null)
            setSuccessMessage(undefined)
            setErrorMessage(undefined)
          }}
          onAssign={(userId) => assigneeTask && handleAssign(assigneeTask, userId)}
          onUnassign={() => assigneeTask && handleUnassign(assigneeTask)}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      )}

      <TaskFormModal
        show={showCreateModal}
        projectId={projectId}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTask}
      />

      <UpdateTaskModal
        show={showEditModal}
        task={editingTask}
        projectId={projectId}
        onClose={() => {
          setShowEditModal(false)
          setEditingTask(null)
        }}
        onUpdate={handleUpdateTask}
      />
    </div>
  )
}

export default KanbanBoard