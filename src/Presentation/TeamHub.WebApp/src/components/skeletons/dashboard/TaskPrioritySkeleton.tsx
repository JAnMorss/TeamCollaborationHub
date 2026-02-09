import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function TaskPrioritySkeleton({}: Props) {
  const priorities = [
    { label: "High", color: "bg-destructive/70 dark:bg-destructive/50" },
    { label: "Medium", color: "bg-yellow-500/70 dark:bg-yellow-500/50" },
    { label: "Low", color: "bg-primary/70 dark:bg-primary/50" },
  ];

  return (
    <Card className="h-full shadow-lg border border-border dark:border-gray-700">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-40 rounded-md bg-gray-300 dark:bg-gray-700" />
      </CardHeader>

      <CardContent className="space-y-4">
        {priorities.map((priority, index) => (
          <div key={index} className="space-y-1 p-1 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <Skeleton className="h-4 w-9 rounded-md bg-gray-300 dark:bg-gray-700" /> 
              <Skeleton className="h-4 w-3 rounded-md bg-gray-300 dark:bg-gray-700" /> 
            </div>

            <div className={`h-5 w-full rounded-lg overflow-hidden ${priority.color}`} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
