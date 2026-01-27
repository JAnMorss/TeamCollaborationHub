import DashboardHeroCard from "@/components/dashboard/cards/DashboardHeroCard";
import DashboardStatsCard from "@/components/dashboard/cards/DashboardStatsCard";
import ProjectProgressCard from "@/components/dashboard/cards/ProjectProgressCard";
import RecentActivityCard from "@/components/dashboard/cards/RecentActivityCard";
import TaskDistributionCard from "@/components/dashboard/cards/TaskDistributionCard";
import TaskPriorityCard from "@/components/dashboard/cards/TaskPriorityCard";
import UpcomingDeadlinesCard from "@/components/dashboard/cards/UpcomingDeadlinesCard";

export default function DashboardPage() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-10">
      <DashboardHeroCard />
      <DashboardStatsCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskDistributionCard />
        <UpcomingDeadlinesCard />
        <TaskPriorityCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectProgressCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}
