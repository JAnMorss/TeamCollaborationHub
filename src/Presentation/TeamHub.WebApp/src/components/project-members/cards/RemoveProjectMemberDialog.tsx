"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface RemoveProjectMemberPayload {
  projectId: string;
  userId: string;
  fullName: string;
}

interface RemoveProjectMemberDialogProps {
  open: boolean;
  member: RemoveProjectMemberPayload | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (payload: RemoveProjectMemberPayload) => void;
}

export function RemoveProjectMemberDialog({
  open,
  member,
  isLoading,
  onClose,
  onConfirm,
}: RemoveProjectMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-semibold">{member?.fullName}</span> from the
            project? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading || !member}
            onClick={() => member && onConfirm(member)}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
