import DashboardHeroCard from "@/components/dashboard/cards/DashboardHeroCard";
import DashboardStatsCard from "@/components/dashboard/cards/DashboardStatsCard";
import ProjectProgressCard from "@/components/dashboard/cards/ProjectProgressCard";
import RecentActivityCard from "@/components/dashboard/cards/RecentActivityCard";
import TaskDistributionCard from "@/components/dashboard/cards/TaskDistributionCard";
import TaskPriorityCard from "@/components/dashboard/cards/TaskPriorityCard";
import UpcomingDeadlinesCard from "@/components/dashboard/cards/UpcomingDeadlinesCard";
import DashboardStatsSkeleton from "@/components/skeletons/dashboard/DashboardStatsSkeleton";
import ProjectProgressSkeleton from "@/components/skeletons/dashboard/ProjectProgressSkeleton";
import RecentActivitySkeleton from "@/components/skeletons/dashboard/RecentActivitySkeleton";
import TaskDistributionSkeleton from "@/components/skeletons/dashboard/TaskDistributionSkeleton";
import TaskPrioritySkeleton from "@/components/skeletons/dashboard/TaskPrioritySkeleton";
import UpcomingTasksSkeleton from "@/components/skeletons/dashboard/UpcomingTasksSkeleton";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-10">
      <DashboardHeroCard />
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStatsCard />
      </Suspense>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense fallback={<TaskDistributionSkeleton />}>
          <TaskDistributionCard />
        </Suspense>
        <Suspense fallback={<UpcomingTasksSkeleton />}>
          <UpcomingDeadlinesCard />
        </Suspense>
        <Suspense fallback={<TaskPrioritySkeleton />}>
          <TaskPriorityCard />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ProjectProgressSkeleton />}>
          <ProjectProgressCard />
        </Suspense>
        <Suspense fallback={<RecentActivitySkeleton />}>
          <RecentActivityCard />
        </Suspense>
      </div>
    </div>
  );
}
