import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const skeletonGray = "bg-gray-200 dark:bg-gray-700";

export default function TasksGridCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, cardIndex) => (
        <Card
          key={cardIndex}
          className="group relative rounded-2xl overflow-hidden bg-card border border-border"
        >
          <CardContent className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <div className="pr-4 flex-1 space-y-2">
                  <Skeleton className={`h-6 w-3/4 ${skeletonGray}`} />
                  <div className="flex items-center gap-2">
                    <Skeleton className={`h-4 w-4 rounded ${skeletonGray}`} />
                    <Skeleton className={`h-4 w-32 ${skeletonGray}`} />
                  </div>
                  <Skeleton className={`h-3 w-40 ${skeletonGray}`} />
                </div>
                <Skeleton className={`h-8 w-8 rounded-md ${skeletonGray}`} />
              </div>

              <div className="mt-3 space-y-2">
                <Skeleton className={`h-4 w-full ${skeletonGray}`} />
                <Skeleton className={`h-4 w-5/6 ${skeletonGray}`} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-border gap-2">
              <Skeleton className={`h-6 w-24 rounded-full ${skeletonGray}`} />
              <Skeleton className={`h-4 w-32 ${skeletonGray}`} />
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {Array.from({ length: 1 }).map((_, attIndex) => (
                <div
                  key={attIndex}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Skeleton className={`h-4 w-4 rounded ${skeletonGray}`} />
                    <Skeleton className={`h-4 w-40 ${skeletonGray}`} />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className={`h-8 w-8 rounded-md ${skeletonGray}`} />
                    <Skeleton className={`h-8 w-8 rounded-md ${skeletonGray}`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
