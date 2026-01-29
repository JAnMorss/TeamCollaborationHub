"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { Task } from "@/schemas/tasks/task.schema";

type TaskPriority = Task["priority"];

const PRIORITY_ORDER: TaskPriority[] = ["High", "Medium", "Low"];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  High: "bg-destructive",      
  Medium: "bg-yellow-500",     
  Low: "bg-primary",    
};

export default function TaskPriorityCard() {
  const { data: tasksResponse } = useSuspenseQuery({
    queryKey: ["tasks", "all"],
    queryFn: tasksApiConnector.getAllTasks,
  });

  const tasks = tasksResponse.data.items;

  const priorityCounts: Record<TaskPriority, number> = {
    High: 0,
    Medium: 0,
    Low: 0,
  };

  tasks.forEach((task) => {
    priorityCounts[task.priority]++;
  });

  const maxValue = Math.max(...Object.values(priorityCounts), 1);

  return (
    <Card className="h-full shadow-lg border border-border dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Task Priority
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {PRIORITY_ORDER.map((priority) => {
          const count = priorityCounts[priority];
          const percentage = (count / maxValue) * 100;

          return (
            <div
              key={priority}
              className="space-y-1 hover:bg-muted/20 dark:hover:bg-muted/40 p-1 rounded-md transition"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{priority}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>

              <div className="h-5 w-full rounded-lg bg-muted dark:bg-muted/50 overflow-hidden relative">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full rounded-lg bg-linear-to-r ${PRIORITY_COLORS[priority]} transition-all duration-500`}
                />
                {percentage > 15 && (
                  <span className="absolute left-2 top-0.5 text-xs font-semibold text-white dark:text-black">
                    {count}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No tasks available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
