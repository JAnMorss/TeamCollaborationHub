"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Project } from "@/schemas/projects/project.schema";

type Props = {
  project: Project | null;
  onClose: () => void;
  onSubmit: (data: {
    id: string;
    name: string;
    description: string;
    color: string;
  }) => void;
  isSaving?: boolean;
};

export default function EditProjectDialog({
  project,
  onClose,
  onSubmit,
  isSaving,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setColor(project.color);
    }
  }, [project]);

  if (!project) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 shadow-lg bg-white">
        <DialogHeader className="flex items-center justify-between mb-4">
          <DialogTitle className="text-lg font-semibold">
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Project Name
            </label>
            <Input
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Project Color
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 p-0 border-0"
              />
              <span className="text-gray-600">{color}</span>
            </div>
          </div>

          <Button
            className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700 transition-all"
            disabled={isSaving}
            onClick={() =>
              onSubmit({
                id: project.id,
                name,
                description,
                color,
              })
            }
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
