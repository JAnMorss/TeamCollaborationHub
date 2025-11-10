import { useState, useEffect } from "react";
import type { ProjectResponse } from "../../models/projects/ProjectResponse";
import { getAllProjects } from "../../services/api/projectApiConnector";
import DashboardHeader from "../../components/common/DashBoard/DashboardHeader/DashboardHeader";
import DashboardRecentProjects from "../../components/common/DashBoard/DashboardRecentProjects/DashboardRecentProjects";
import DashboardStatsGrid from "../../components/common/DashBoard/DashboardStatsGrid/DashboardStatsGrid";

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

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600">Loading...</div>
    );

  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + (p.tasks ?? 0), 0);
  const totalMembers = projects.reduce(
    (acc, p) => acc + (Array.isArray(p.members) ? p.members.length : 0),
    0
  );
  const totalCompletedTasks = projects.reduce((acc, p) => acc + (p.completed ?? 0), 0);
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((totalCompletedTasks / totalTasks) * 100);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <DashboardHeader />
      <DashboardStatsGrid
        totalProjects={totalProjects}
        totalTasks={totalTasks}
        totalMembers={totalMembers}
        completionRate={completionRate}
      />
      <DashboardRecentProjects projects={projects} />
    </div>
  );
}
