import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function RecentActivitySkeleton({}: Props) {
  const skeletonItems = Array.from({ length: 6 });

  return (
    <Card className="p-6 flex flex-col gap-6 rounded-xl border shadow-sm">
      {/* Card Title */}
      <CardHeader className="p-0">
        <Skeleton className="h-6 w-40 mb-4 rounded-md bg-gray-400 dark:bg-gray-600" />
      </CardHeader>

      {/* Activity List */}
      <CardContent className="p-0 space-y-4">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
          >
            {/* Avatar */}
            <Skeleton className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />

            {/* Text skeletons */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <Skeleton className="h-3 w-110 rounded-md bg-gray-400 dark:bg-gray-600" />
              <Skeleton className="h-2 w-12 mt-1 rounded-md bg-gray-400 dark:bg-gray-600" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
