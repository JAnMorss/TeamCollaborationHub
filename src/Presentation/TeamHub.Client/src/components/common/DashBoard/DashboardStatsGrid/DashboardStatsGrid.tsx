import { FaRegUser, FaRegStar, FaRegFolderOpen } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import StatCard from "../StatCard/StatCard";

interface DashboardStatsGridProps {
  totalProjects: number;
  totalTasks: number;
  totalMembers: number;
  completionRate: number;
}

export default function DashboardStatsGrid({
  totalProjects,
  totalTasks,
  totalMembers,
  completionRate,
}: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <StatCard
        label="Total Projects"
        value={totalProjects}
        icon={<FaRegFolderOpen className="w-6 h-6 text-blue-600" />}
        bgColor="bg-blue-100"
      />
      <StatCard
        label="Active Tasks"
        value={totalTasks}
        icon={<LuClock4 className="w-6 h-6 text-green-600" />}
        bgColor="bg-green-100"
      />
      <StatCard
        label="Team Members"
        value={totalMembers}
        icon={<FaRegUser className="w-6 h-6 text-purple-600" />}
        bgColor="bg-purple-100"
      />
      <StatCard
        label="Completion"
        value={`${completionRate}%`}
        icon={<FaRegStar className="w-6 h-6 text-yellow-600" />}
        bgColor="bg-yellow-100"
      />
    </div>
  );
}
