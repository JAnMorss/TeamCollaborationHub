import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function UpcomingTasksSkeleton({}: Props) {
  const skeletonTasks = Array.from({ length: 4 }); 

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-40 rounded-md bg-gray-400 dark:bg-gray-600" />
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-2">
          <Skeleton className="h-3 w-14 rounded-md bg-destructive/60 dark:bg-destructive/80" />

          <ul className="space-y-1">
            {skeletonTasks.map((_, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-md px-3 py-2"
              >
                <Skeleton className="h-3 w-24 rounded-md bg-gray-400 dark:bg-gray-600" />
                <Skeleton className="h-3 w-12 rounded-full bg-destructive/60 dark:bg-destructive/80" />
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-border" />

        <section className="space-y-2">
          <Skeleton className="h-3 w-28 rounded-md bg-gray-400 dark:bg-gray-600" />
          <Skeleton className="h-3 w-32 rounded-md bg-gray-400 dark:bg-gray-600 mt-2" />
        </section>
      </CardContent>
    </Card>
  );
}
