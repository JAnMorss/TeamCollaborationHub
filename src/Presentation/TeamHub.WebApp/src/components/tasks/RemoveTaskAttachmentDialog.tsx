"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveTaskAttachmentDialogProps {
  attachmentId: string;
  onClose: () => void;
}

export default function RemoveTaskAttachmentDialog({ attachmentId, onClose }: RemoveTaskAttachmentDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => tasksApiConnector.removeTaskAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Attachment?</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to remove this attachment?</p>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
