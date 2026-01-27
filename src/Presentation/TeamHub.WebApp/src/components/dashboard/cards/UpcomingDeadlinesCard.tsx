"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, addDays, isAfter, isBefore } from "date-fns";

export default function UpcomingTasksCard() {
  const { data: tasksData } = useSuspenseQuery({
    queryKey: ["tasks", "all"],
    queryFn: tasksApiConnector.getAllTasks,
  });

  const tasks = tasksData.data.items;

  const today = new Date();
  const nextWeek = addDays(today, 7);

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") return false;
    const dueDate = new Date(task.dueDate);
    return isAfter(dueDate, today) && isBefore(dueDate, nextWeek);
  });

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") return false;
    return isBefore(new Date(task.dueDate), today);
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Tasks Timeline
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-destructive">
            Overdue
          </h3>

          {overdueTasks.length > 0 ? (
            <ul className="space-y-1">
              {overdueTasks.map((task) => (
                <li
                  key={task.id}
                  className="
                    flex items-center justify-between
                    rounded-md px-3 py-2 text-sm
                    hover:bg-muted transition-colors
                  "
                >
                  <span className="truncate text-foreground">
                    {task.title}
                  </span>

                  <span className="
                    shrink-0 rounded-full
                    bg-destructive/10 px-2 py-0.5
                    text-xs font-medium text-destructive
                  ">
                    {format(new Date(task.dueDate!), "MMM dd")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              🎉 No overdue tasks
            </p>
          )}
        </section>

        <div className="border-t border-border" />

        <section className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            Next 7 Days
          </h3>

          {upcomingTasks.length > 0 ? (
            <ul className="space-y-1">
              {upcomingTasks.map((task) => (
                <li
                  key={task.id}
                  className="
                    flex items-center justify-between
                    rounded-md px-3 py-2 text-sm
                    hover:bg-muted transition-colors
                  "
                >
                  <span className="truncate text-foreground">
                    {task.title}
                  </span>

                  <span className="
                    shrink-0 rounded-full
                    bg-accent px-2 py-0.5
                    text-xs text-accent-foreground
                  ">
                    {format(new Date(task.dueDate!), "MMM dd")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No upcoming tasks
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
