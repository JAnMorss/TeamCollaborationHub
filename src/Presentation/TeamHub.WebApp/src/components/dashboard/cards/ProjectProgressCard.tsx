import { useSuspenseQuery } from "@tanstack/react-query";
import { projectsApiConnector } from "@/api/projects/project.api";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

export default function ProjectProgressCard() {
  const { data: projectsData } = useSuspenseQuery({
    queryKey: ["projects", "all"],
    queryFn: projectsApiConnector.getAllProjects,
  });

  const { data: tasksData } = useSuspenseQuery({
    queryKey: ["tasks", "all"],
    queryFn: tasksApiConnector.getAllTasks,
  });

  const projects = projectsData.data.items;
  const tasks = tasksData.data.items;

  const projectProgress = projects.map((project) => {
    const projectTasks = tasks.filter(
      (task) => task.projectId === project.id
    );

    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    return {
      id: project.id,
      name: project.name,
      totalTasks,
      completedTasks,
      progress,
    };
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Project Progress
      </h2>

      <div className="space-y-5">
        {projectProgress.map((project) => (
          <div key={project.id}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {project.name}
              </span>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                {project.completedTasks}/{project.totalTasks} tasks
              </span>
            </div>

            <Progress value={project.progress} className="h-2" />

            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {project.progress}% complete
            </div>
          </div>
        ))}

        {projectProgress.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            No projects available
          </p>
        )}
      </div>
    </Card>
  );
}
