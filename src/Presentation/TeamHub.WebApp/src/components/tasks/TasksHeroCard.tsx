import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CreateTaskDialog from "./CreateTaskDialog";

export default function TasksHeroCard() {
  return (
    <Card
      className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl
                 dark:from-indigo-900 dark:to-indigo-800"
    >
      <CardHeader>
        <CardTitle className="text-4xl font-bold">Tasks</CardTitle>
        <CardDescription className="text-lg text-white/80">
          Manage and track all your tasks
        </CardDescription>

        <div className="mt-4">
          <CreateTaskDialog />
        </div>
      </CardHeader>
    </Card>
  );
}
