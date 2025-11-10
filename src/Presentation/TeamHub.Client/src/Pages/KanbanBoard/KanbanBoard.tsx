import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "To-Do" | "In Progress" | "Review" | "Completed";
  tags?: string[];
  assignee?: string;
  dueDate?: string;
};

type KanbanBoardProps = {
  projectName: string;
  onBack: () => void;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectName, onBack }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Feedback", status: "To-Do", tags: ["customer"], dueDate: "28 Feb" },
    { id: "2", title: "Launch Prep", status: "In Progress", tags: ["design"], dueDate: "01 Mar" },
    { id: "3", title: "Design Review", status: "Review", tags: ["UI", "dev"], dueDate: "03 Mar" },
    { id: "4", title: "Validation", status: "Completed", tags: ["QA"], dueDate: "06 Mar" },
  ]);

  const statuses: Task["status"][] = ["To-Do", "In Progress", "Review", "Completed"];

  const handleAddTask = (status: Task["status"]) => {
    const title = prompt("Enter task title:");
    if (title) {
      setTasks([...tasks, { id: Date.now().toString(), title, status }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{projectName} — Board</h2>
          <p className="text-gray-500">Manage tasks visually</p>
        </div>
        <button onClick={onBack} className="text-blue-600 hover:underline">
          ← Back to Projects
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
        {statuses.map((status) => (
          <div key={status} className="bg-white rounded-lg shadow-md p-4 flex flex-col h-[70vh]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">{status}</h3>
              <button
                onClick={() => handleAddTask(status)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <FiPlus className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-medium text-gray-900">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500 mt-1">📅 {task.dueDate}</p>
                    )}
                    <div className="flex flex-wrap mt-2 gap-1">
                      {task.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={() => handleAddTask(status)}
              className="mt-3 text-sm text-blue-600 flex items-center justify-center hover:text-blue-700"
            >
              <FiPlus className="mr-1" /> Add a task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
