"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Task, ValidationErrorResponse, UploadTaskAttachmentResponse } from "@/schemas/tasks/task.schema";

interface UploadAttachmentDialogProps {
  task: Task;
  onClose: () => void;
}

export default function UploadAttachmentDialog({ task, onClose }: UploadAttachmentDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation<
    UploadTaskAttachmentResponse | ValidationErrorResponse, 
    Error,
    File
  >({
    mutationFn: (file: File) => tasksApiConnector.uploadTaskAttachment(task.id, file),
    onSuccess: (response) => {
      if ("data" in response) {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    },
  });

  const handleUpload = async () => {
    for (const file of files) {
      await uploadMutation.mutateAsync(file);
    }
    setFiles([]);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Attachments for "{task.title}"</DialogTitle>
        </DialogHeader>

        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
          className="my-4"
        />

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={files.length === 0 || uploadMutation.isPending}
            onClick={handleUpload}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
