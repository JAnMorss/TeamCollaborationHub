"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { projectsApiConnector } from "@/api/projects/project.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateProjectDialog() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");

  const mutation = useMutation({
    mutationFn: projectsApiConnector.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setName("");
      setDescription("");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
            className="flex items-center gap-2 bg-white text-blue-600 hover:bg-white/90 hover:text-blue-700 font-semibold transition"
        >
            <Plus className="h-4 w-4" />
            Create Project
        </Button>

      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-6 shadow-lg bg-white">
        <DialogHeader className="flex items-center justify-between mb-4">
          <DialogTitle className="text-lg font-semibold">
            Create Project
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
            onClick={() => mutation.mutate({ name, description, color })}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
