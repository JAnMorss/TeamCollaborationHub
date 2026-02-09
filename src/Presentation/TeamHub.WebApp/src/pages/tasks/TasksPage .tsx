import TasksGridCardSkeleton from "@/components/skeletons/task/TasksGridCardSkeleton";
import TasksGridCard from "@/components/tasks/TasksGridCard";
import TasksHeroCard from "@/components/tasks/TasksHeroCard";
import { Suspense } from "react";

export default function TasksPage() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-10">
      <TasksHeroCard />
      <div className="flex justify-end items-center">
      </div>
      <Suspense fallback={<TasksGridCardSkeleton />}>
        <TasksGridCard />
      </Suspense>
    </div>
  );
}