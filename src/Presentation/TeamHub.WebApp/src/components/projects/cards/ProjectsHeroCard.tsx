import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CreateProjectDialog from "./CreateProjectDialog";

export default function ProjectsHeroCard() {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl
             dark:from-indigo-900 dark:to-indigo-800">
      <CardHeader>
        <CardTitle className="text-4xl font-bold">Projects</CardTitle>
        <CardDescription className="text-lg text-white/80">
          Manage and track all your projects
        </CardDescription>
        <div className="mt-4">
          <CreateProjectDialog />
        </div>
      </CardHeader>
    </Card>
  );
}
