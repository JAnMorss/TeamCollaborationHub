"use client";

import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
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
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="mb-2"
        >
          Choose Files
        </Button>

        {files.length > 0 && (
          <ul className="mb-4 max-h-32 overflow-auto border border-gray-200 rounded p-2 bg-gray-50 text-sm">
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}

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
