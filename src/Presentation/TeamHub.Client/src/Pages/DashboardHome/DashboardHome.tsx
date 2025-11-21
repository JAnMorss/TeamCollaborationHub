import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { ProjectResponse } from "../../models/projects/ProjectResponse";
import type { TaskResponse } from "../../models/tasks/TaskResponse";
import { getAllProjects } from "../../services/api/projectApiConnector";
import { getAllTasks } from "../../services/api/taskApiConnector";
import DashboardRecentProjects from "../../components/common/DashBoard/DashboardRecentProjects/DashboardRecentProjects";
import DashboardStatsGrid from "../../components/common/DashBoard/DashboardStatsGrid/DashboardStatsGrid";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, tasksData] = await Promise.all([
          getAllProjects(),
          getAllTasks(),
        ]);
        setProjects(projectsData.items);
        setTasks(tasksData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-600">{error}</div>
    );

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const totalMembers = projects.reduce(
    (acc, p) => acc + (Array.isArray(p.members) ? p.members.length : 0),
    0
  );
  const totalCompletedTasks = tasks.filter((t) => t.status === "Completed")
    .length;
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((totalCompletedTasks / totalTasks) * 100);

  const now = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - i));
    return date;
  });
  const progressData = last7Days.map((date) => {
    const completedUpToDate = tasks.filter(
      (task) =>
        task.status === "Completed" &&
        new Date(task.createdAt) <= date
    ).length;
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      completed: completedUpToDate,
      total: tasks.filter(
        (task) => new Date(task.createdAt) <= date
      ).length,
    };
  });

  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    {
      name: "Completed",
      value: statusCounts["Completed"] || 0,
      color: "#10b981",
    },
    {
      name: "In Progress",
      value: statusCounts["InProgress"] || 0,
      color: "#3b82f6",
    },
    { name: "Review", value: statusCounts["Review"] || 0, color: "#f59e0b" },
    { name: "Todo", value: statusCounts["Todo"] || 0, color: "#6b7280" },
  ];

  const upcomingDeadlines = tasks
    .filter((task) => task.dueDate && new Date(task.dueDate) > new Date())
    .sort(
      (a, b) =>
        new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
    .slice(0, 4)
    .map((task) => ({
      task: task.title,
      project: task.projectName || "Unknown Project",
      dueDate: new Date(task.dueDate!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      priority: task.priority?.toLowerCase() || "medium",
    }));

  const activities = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map((task) => ({
      id: task.id,
      type: "task",
      message:
        task.status === "Completed"
          ? `Task '${task.title}' completed`
          : task.status === "InProgress"
          ? `Task '${task.title}' started`
          : task.status === "Review"
          ? `Task '${task.title}' under review`
          : `Task '${task.title}' created`,
      project: task.projectName || "Unknown Project",
      time: `${Math.floor(
        (Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60)
      )} hours ago`,
      user: task.assignedTo || task.createdBy || "Unknown",
    }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-default";
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-theme">Dashboard</h2>
        </div>
      </div>

      <DashboardStatsGrid
        totalProjects={totalProjects}
        totalTasks={totalTasks}
        totalMembers={totalMembers}
        completionRate={completionRate}
      />

      <div className="flex gap-4 mb-8">
        <Link
          to="/dashboard/projects"
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex-1"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">New Project</span>
        </Link>

        <Link
          to="/dashboard/tasks"
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex-1"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Add Task</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-base-100 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Task Completion Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) =>
                  name === "completed"
                    ? [`${value}`, "Completed Tasks"]
                    : [`${value}`, "Total Tasks"]
                }
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10b981' }}></span>
              <span className="text-muted font-medium">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#3b82f6' }}></span>
              <span className="text-muted font-medium">Total</span>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Task Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) =>
                  [`${value} (${((value / totalTasks) * 100).toFixed(0)}%)`, name]
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full`}
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-base-100 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-green-100`}
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.project} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-100 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${getPriorityColor(
                  deadline.priority
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{deadline.task}</p>
                    <p className="text-xs mt-1 opacity-75">{deadline.project}</p>
                  </div>
                  <span className="text-xs font-medium uppercase px-2 py-1 rounded">
                    {deadline.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {deadline.dueDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DashboardRecentProjects projects={projects} />
    </div>
  );
}
