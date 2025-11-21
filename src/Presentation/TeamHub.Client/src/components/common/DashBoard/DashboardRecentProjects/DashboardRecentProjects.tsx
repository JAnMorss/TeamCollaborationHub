import type { ProjectResponse } from "../../../../models/projects/ProjectResponse";

interface DashboardRecentProjectsProps {
  projects: ProjectResponse[];
}

export default function DashboardRecentProjects({ projects }: DashboardRecentProjectsProps) {
  return (
    <div className="card card-hover rounded-xl border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Projects</h3>
      </div>

      <div className="p-4 sm:p-6 overflow-x-auto">
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base text-center py-6">
            No projects available
          </p>
        ) : (
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => {
              const membersCount = Array.isArray(project.members)
                ? project.members.length
                : 0;
              const completed = project.completed ?? 0;
              const tasks = project.tasks ?? 0;
              const progress = tasks ? (completed / tasks) * 100 : 0;

              return (
                <div
                  key={project.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 card-item rounded-lg gap-3"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: project.color || "#ccc" }}
                    ></div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {project.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">{project.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center sm:space-x-6 space-x-4 justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{membersCount}</p>
                      <p className="text-xs text-gray-600">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        {completed}/{tasks}
                      </p>
                      <p className="text-xs text-gray-600">Tasks</p>
                    </div>
                    <div className="w-20">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
