import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  count?: number;
};

export default function ProjectsGridCardSkeleton({ count = 6 }: Props) {
  const skeletons = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((_, index) => (
        <Card
          key={index}
          className="group relative rounded-2xl overflow-hidden bg-card border shadow-sm"
        >
          <div className="absolute left-0 top-0 h-full w-2 rounded-l-2xl bg-gray-300 dark:bg-gray-700" />

          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="pr-4 flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4 rounded-md bg-gray-400 dark:bg-gray-600" />
                <Skeleton className="h-3 w-1/2 rounded-md bg-gray-300 dark:bg-gray-700" />
              </div>
              <Skeleton className="h-6 w-3 rounded-md bg-gray-300 dark:bg-gray-700" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-4 w-5/6 rounded-md bg-gray-300 dark:bg-gray-700" />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <Skeleton className="h-5 w-20 rounded-full bg-gray-400 dark:bg-gray-600" />
              <Skeleton className="h-4 w-20 rounded-md bg-gray-300 dark:bg-gray-700" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
