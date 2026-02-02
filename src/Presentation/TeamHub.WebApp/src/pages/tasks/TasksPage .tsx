import TasksGridCard from "@/components/tasks/TasksGridCard";
import TasksHeroCard from "@/components/tasks/TasksHeroCard";

export default function TasksPage() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-10">
      <TasksHeroCard />
      <div className="flex justify-end items-center">
      </div>
      <TasksGridCard />
    </div>
  );
}