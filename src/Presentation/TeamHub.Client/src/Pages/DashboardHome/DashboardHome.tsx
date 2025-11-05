import { useState, useEffect } from "react";
import { GoPlus } from "react-icons/go";
import { FaRegUser, FaRegStar, FaRegFolderOpen } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import type { ProjectResponse } from "../../models/projects/ProjectResponse";
import { getAllProjects } from "../../services/api/projectApiConnector";

export default function DashboardHome() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data.items);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + (p.tasks ?? 0), 0);
  const totalMembers = projects.reduce((acc, p) => acc + (Array.isArray(p.members) ? p.members.length : 0), 0);
  const totalCompletedTasks = projects.reduce((acc, p) => acc + (p.completed ?? 0), 0);
  const completionRate = totalTasks === 0 ? 0 : Math.round((totalCompletedTasks / totalTasks) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <GoPlus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaRegFolderOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <LuClock4 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaRegUser className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaRegStar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => {
              const membersCount = Array.isArray(project.members) ? project.members.length : 0;
              const completed = project.completed ?? 0;
              const tasks = project.tasks ?? 0;
              const progress = tasks ? (completed / tasks) * 100 : 0;

              return (
                <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: project.color || "#ccc" }}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
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
        </div>
      </div>
    </div>
  );
}
