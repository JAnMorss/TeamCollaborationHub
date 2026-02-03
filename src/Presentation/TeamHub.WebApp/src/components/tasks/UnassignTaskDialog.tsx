import { tasksApiConnector } from "@/api/tasks/tasks.api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  assigneeName?: string;
  onUnassigned?: () => void;
};

export default function UnassignTaskDialog({
  open,
  onOpenChange,
  taskId,
  assigneeName,
  onUnassigned,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleUnassign = async () => {
    try {
      setLoading(true);

      await tasksApiConnector.unassignTask(taskId);

      toast.success("Task unassigned successfully");
      onOpenChange(false);
      onUnassigned?.();
    } catch (error) {
      toast.error("Failed to unassign task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unassign Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unassign{" "}
            <span className="font-medium">
              {assigneeName ?? "this user"}
            </span>{" "}
            from this task?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnassign}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Unassigning..." : "Unassign"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
