import { projectsApiConnector } from "@/api/projects/project.api";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import { useSuspenseQuery } from "@tanstack/react-query";
import Card from "./Card";
import { FolderIcon, UsersIcon, CheckCircleIcon, ClipboardListIcon } from "lucide-react";

export default function DashboardStatsCard() {
  const { data: projectsData } = useSuspenseQuery({
    queryKey: ["projects", "all"],
    queryFn: projectsApiConnector.getAllProjects,
  });

  const { data: tasksData } = useSuspenseQuery({
    queryKey: ["tasks", "all"],
    queryFn: tasksApiConnector.getAllTasks,
  });

  const { items: projects, totalCount: totalProjects } = projectsData.data;
  const allTasks = tasksData.data.items;

  const membersCount = projects.reduce((acc, project) => acc + (project.members?.length || 0), 0);
  const activeTasksCount = allTasks.filter((t) => t.status !== "Completed").length;
  const completedTasks = allTasks.filter((t) => t.status === "Completed").length;
  const completionRate = allTasks.length === 0 ? 0 : Math.round((completedTasks / allTasks.length) * 100);

  const stats = [
    { label: "Total Projects", value: totalProjects, icon: FolderIcon, color: "blue" },
    { label: "Members", value: membersCount, icon: UsersIcon, color: "green" },
    { label: "Active Tasks", value: activeTasksCount, icon: ClipboardListIcon, color: "orange" },
    { label: "Completion Rate", value: `${completionRate}%`, icon: CheckCircleIcon, color: "purple" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
          green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
          orange: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
          purple: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
        }[stat.color];

        return (
          <Card
            key={stat.label}
            className="p-6 flex-1 min-w-[220px] shadow-md hover:shadow-lg transition-shadow rounded-xl animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${colorClasses}`}>
                <Icon className="w-8 h-8" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
