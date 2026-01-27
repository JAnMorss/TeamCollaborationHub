"use client";

import { tasksApiConnector } from "@/api/tasks/tasks.api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Task } from "@/schemas/tasks/task.schema";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type TaskStatus = Task["status"];

const COLORS: Record<TaskStatus, string> = {
  Completed: "#10b981", 
  InProgress: "#3b82f6", 
  Review: "#f59e0b", 
  Todo: "#9ca3af", 
};

export default function TaskDistributionCard() {
  const { data: tasksResponse } = useSuspenseQuery({
    queryKey: ["tasks", "all"],
    queryFn: tasksApiConnector.getAllTasks,
  });

  const tasks = tasksResponse.data.items;

  const statusCounts: Record<TaskStatus, number> = {
    Completed: 0,
    InProgress: 0,
    Review: 0,
    Todo: 0,
  };

  tasks.forEach((task) => {
    statusCounts[task.status]++;
  });

  const chartData = Object.entries(statusCounts).map(
    ([status, value]) => ({
      name: status,
      value,
    })
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
      </CardHeader>

      <CardContent className="h-[280px]">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tasks available.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name as TaskStatus]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
