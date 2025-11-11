import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { BsPersonCheck, BsPersonX } from "react-icons/bs";
import type { TaskResponse } from "../../models/tasks/TaskResponse";
import type { TaskRequest } from "../../models/tasks/TaskRequest";
import {
  getTasksByProjectId,
  createTask,
  assignTask,
  unassignTask,
} from "../../services/api/taskApiConnector";
import TaskModal from "../../components/common/Task/TaskModal/TaskModal";
import TaskAssigneeModal from "../../components/common/Task/TaskAssigneeModal/TaskAssigneeModal";

type KanbanBoardProps = {
  projectId: string;
  projectName: string;
  currentUserId: string;
  onBack: () => void;
};

const statusConfig = {
  Todo: { color: "from-slate-500 to-slate-600", badge: "badge-secondary", header: "bg-secondary/10" },
  InProgress: { color: "from-blue-500 to-blue-600", badge: "badge-info", header: "bg-info/10" },
  Review: { color: "from-amber-500 to-amber-600", badge: "badge-warning", header: "bg-warning/10" },
  Completed: { color: "from-emerald-500 to-emerald-600", badge: "badge-success", header: "bg-success/10" },
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projectId,
  projectName,
  currentUserId,
  onBack,
}) => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [assigneeTask, setAssigneeTask] = useState<TaskResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined); 
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined); 

  const statuses: TaskResponse["status"][] = [
    "Todo",
    "InProgress",
    "Review",
    "Completed",
  ];

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasksByProjectId(projectId);
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleAddTask = async (status: TaskResponse["status"]) => {
    const title = prompt("Enter task title:");
    if (!title) return;

    const newTask: TaskRequest = {
      title,
      status,
      projectId,
      description: "",
      priority: "Medium",
      dueDate: "",
    };

    try {
      const created = await createTask(newTask);
      setTasks((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="mb-8 animate-fade-in">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
              {projectName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Manage tasks visually on your board</p>
          </div>
          <button
            onClick={onBack}
            className="btn btn-ghost gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
          >
            ← Back
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-slate-600 dark:text-slate-400">Loading tasks...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
          {statuses.map((status, index) => (
            <div key={status} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div
                className={`${statusConfig[status as keyof typeof statusConfig].header} rounded-t-xl p-4 border-b-4 border-gradient`}
                style={{
                  borderImageSource: `linear-gradient(to right, var(--color-${status}), transparent)`,
                  borderImageSlice: 1,
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{status}</h3>
                    <span className={`badge ${statusConfig[status as keyof typeof statusConfig].badge} badge-sm`}>
                      {tasks.filter((t) => t.status === status).length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddTask(status)}
                    className="btn btn-sm btn-circle hover:scale-110 transition-transform duration-200"
                    title="Add new task"
                  >
                    <FiPlus size={18} />
                  </button>
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

                          <div className="mt-3 space-y-2">
                            {task.dueDate && (
                              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                <span>📅</span>
                                <span>
                                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
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

                        <button
                          onClick={() => setAssigneeTask(task)}
                          className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          title={task.assignedToId === currentUserId ? "Unassign or change" : "Assign task"}
                        >
                          {task.assignedToId ? (
                            <BsPersonCheck size={18} className="text-emerald-500" />
                          ) : (
                            <BsPersonX size={18} />
                          )}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {successMessage && (
        <div className="toast toast-top toast-end animate-slide-in">
          <div className="alert alert-success">
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="toast toast-top toast-end animate-slide-in">
          <div className="alert alert-error">
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
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
    </div>
  );
};

export default KanbanBoard;
