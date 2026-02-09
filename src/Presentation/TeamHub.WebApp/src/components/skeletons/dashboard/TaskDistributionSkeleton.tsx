import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function TaskDistributionSkeleton({}: Props) {
  const legendItems = ["Completed", "InProgress", "Review", "Todo"];

  const legendColors: Record<string, string> = {
    Completed: "bg-green-500 dark:bg-green-700",
    InProgress: "bg-blue-500 dark:bg-blue-700",
    Review: "bg-yellow-500 dark:bg-yellow-700",
    Todo: "bg-gray-400 dark:bg-gray-600",
  };

  return (
    <Card className="h-full flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <CardHeader className="px-6 pb-6">
        <Skeleton className="h-5 w-40 rounded-md bg-gray-400 dark:bg-gray-600" />
      </CardHeader>

      <CardContent className="px-6 h-70 flex flex-col items-center justify-center gap-4 relative">
        <div className="relative">
          <Skeleton className="w-45 h-45 mb-25 rounded-full bg-gray-400 dark:bg-gray-600" />
        </div>

        <div className="absolute bottom-2 flex flex-wrap justify-center gap-4 w-full">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className={`w-4 h-4 rounded-full ${legendColors[item]}`} />
              <Skeleton className="h-3 w-20 rounded-md bg-gray-400 dark:bg-gray-600" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
