import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AddProjectMemberDialog from "./AddProjectMemberDialog";

export default function ProjectMembersHeroCard() {
  return (
    <Card className="bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-2xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-4xl font-bold">Project Members</CardTitle>
        <CardDescription className="text-white/80 text-lg">
          Manage members and their roles in this project
        </CardDescription>

        <div>
          <AddProjectMemberDialog />
        </div>
      </CardHeader>
    </Card>
  );
}
