
import ProjectsGridCard from "@/components/projects/cards/ProjectsGridCard";
import ProjectsHeroCard from "@/components/projects/cards/ProjectsHeroCard"
import ProjectsGridCardSkeleton from "@/components/skeletons/projects/ProjectsGridCardSkeleton";
import { Suspense } from "react";

export default function ProjectsPage() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-10">
      <ProjectsHeroCard />
      <div className="flex justify-end items-center">
        
      </div>
      <Suspense fallback={<ProjectsGridCardSkeleton />}>
        <ProjectsGridCard />
      </Suspense>
    </div>
  );
}