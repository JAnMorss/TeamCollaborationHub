import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const skeletonGray = "bg-gray-200 dark:bg-gray-700"

export default function ProjectMembersGridSkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className={`h-5 w-5 rounded-md ${skeletonGray}`} />
          <Skeleton className={`h-5 w-36 ${skeletonGray}`} />
        </div>
        <Skeleton className={`h-5 w-10 rounded-full ${skeletonGray}`} />
      </CardHeader>

      <CardContent className="space-y-8">
        {Array.from({ length: 3 }).map((_, projectIndex) => (
          <div key={projectIndex} className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className={`h-5 w-48 ${skeletonGray}`} />
              <Skeleton className={`h-5 w-24 rounded-full ${skeletonGray}`} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, memberIndex) => (
                <Card
                  key={memberIndex}
                  className="relative rounded-2xl border p-6"
                >
                  <CardContent className="space-y-4 p-0">
                    <div className="flex items-center gap-4">
                      <Skeleton className={`h-12 w-12 rounded-full ${skeletonGray}`} />
                      <Skeleton className={`h-5 w-40 ${skeletonGray}`} />
                    </div>

                    <Skeleton className={`h-5 w-20 rounded-full ${skeletonGray}`} />

                    <Skeleton className={`h-4 w-48 ${skeletonGray}`} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
