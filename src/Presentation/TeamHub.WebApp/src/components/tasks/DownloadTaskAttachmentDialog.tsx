"use client";

import { useState } from "react";
import { tasksApiConnector } from "@/api/tasks/tasks.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DownloadTaskAttachmentDialogProps {
  attachmentId: string;
  fileName: string;
  onClose: () => void;
}

export default function DownloadTaskAttachmentDialog({
  attachmentId,
  fileName,
  onClose,
}: DownloadTaskAttachmentDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAttachment = async (attachmentId: string, fileName: string) => {
    try {
      setIsDownloading(true);
      const blob = await tasksApiConnector.downloadTaskAttachment(attachmentId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error("Failed to download attachment:", error);
      // Optional: show user feedback here
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Attachment?</DialogTitle>
        </DialogHeader>
        <p>Do you want to download <strong>{fileName}</strong>?</p>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDownloading}>
            Cancel
          </Button>
          <Button
            variant="default"  
            onClick={() => downloadAttachment(attachmentId, fileName)}
            disabled={isDownloading}
            >
            {isDownloading ? "Downloading..." : "Download"}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
