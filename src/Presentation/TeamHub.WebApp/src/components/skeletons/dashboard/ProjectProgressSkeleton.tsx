import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function ProjectProgressSkeleton({}: Props) {
  const skeletonProjects = Array.from({ length: 5 });

  return (
    <Card className="p-6">
      <CardHeader className="p-0">
        <Skeleton className="h-6 w-40 mb-4 rounded-md bg-gray-400 dark:bg-gray-600" />
      </CardHeader>

      <div className="space-y-5">
        {skeletonProjects.map((_, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-4 w-32 rounded-md bg-gray-400 dark:bg-gray-600" />
              <Skeleton className="h-3 w-16 rounded-md bg-gray-400 dark:bg-gray-600" />
            </div>

            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <Skeleton className="h-2 w-1/2 rounded-full" />
            </div>

            <Skeleton className="h-3 w-12 mt-1 rounded-md bg-gray-400 dark:bg-gray-600" />
          </div>
        ))}
      </div>
    </Card>
  );
}
