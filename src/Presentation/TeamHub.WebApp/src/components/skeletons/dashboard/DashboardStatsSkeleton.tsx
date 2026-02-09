import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function DashboardStatsSkeleton({}: Props) {
  const stats = [
    { label: "Total Projects", color: "blue" },
    { label: "Members", color: "green" },
    { label: "Active Tasks", color: "orange" },
    { label: "Completion Rate", color: "purple" },
  ];

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900",
    green: "bg-green-100 dark:bg-green-900",
    orange: "bg-orange-100 dark:bg-orange-900",
    purple: "bg-purple-100 dark:bg-purple-900",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-6 flex-1 min-w-55 shadow-md rounded-xl animate-pulse bg-white dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16 rounded-md" />  
                <Skeleton className="h-6 w-12 rounded-md" />  
            </div>

            <div className={`p-4 rounded-lg ${colorClasses[stat.color]}`}>
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
