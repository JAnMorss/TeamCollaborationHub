import ProjectMembersGridCard from "@/components/project-members/cards/ProjectMembersGridCard"
import ProjectMembersHeroCard from "@/components/project-members/cards/ProjectMembersHeroCard"
import ProjectMembersGridSkeleton from "@/components/skeletons/projects/ProjectMembersGridSkeleton"
import { Suspense } from "react"


type Props = {}

export default function ProjectMembersPage({}: Props) {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-10">
      <ProjectMembersHeroCard />
      <Suspense fallback={<ProjectMembersGridSkeleton />}>
        <ProjectMembersGridCard />
      </Suspense>
    </div>
  )
}