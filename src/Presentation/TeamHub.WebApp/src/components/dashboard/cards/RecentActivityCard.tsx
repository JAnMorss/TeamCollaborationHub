import { useSuspenseQuery } from "@tanstack/react-query";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import { Card } from "@/components/ui/card";

type Activity = {
  user: string;
  action: string;
  item: string;
  time: string;
};

export default function RecentActivityCard() {
  const { data: tasksData } = useSuspenseQuery({
    queryKey: ["tasks", "all"],
    queryFn: tasksApiConnector.getAllTasks,
  });

  const tasks = tasksData.data.items;

  const activities: Activity[] = [];

  tasks.forEach((task) => {
    if (task.createdBy) {
      activities.push({
        user: task.createdBy,
        action: "created task",
        item: task.title,
        time: formatTime(task.createdAt),
      });
    }

    if (task.status === "Completed") {
      activities.push({
        user: task.assignedTo ?? task.createdBy ?? "Someone",
        action: "completed task",
        item: task.title,
        time: formatTime(task.createdAt),
      });
    }

    if (task.assignedTo && task.createdBy) {
      activities.push({
        user: task.createdBy,
        action: "assigned task to",
        item: task.assignedTo,
        time: formatTime(task.createdAt),
      });
    }

    if (Array.isArray(task.attachments)) {
      task.attachments.forEach((attachment) => {
        activities.push({
          user: attachment.uploadedBy ?? "Someone",
          action: "uploaded attachment to",
          item: task.title,
          time: formatTime(attachment.uploadedAt),
        });
      });
    }
  });

  const sortedActivities = activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8); 

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {sortedActivities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {getInitials(activity.user)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                <span className="font-medium">{activity.user}</span>{" "}
                {activity.action}{" "}
                <span className="font-medium">{activity.item}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {timeAgo(activity.time)}
              </p>
            </div>
          </div>
        ))}

        {sortedActivities.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            No recent activity
          </p>
        )}
      </div>
    </Card>
  );
}


function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatTime(date: string) {
  return new Date(date).toISOString();
}

function timeAgo(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
