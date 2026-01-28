"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ----------------------------- Schema ----------------------------- */

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

/* ----------------------------- Props ------------------------------ */

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: {
    id: string;
    name: string;
    description?: string | null;
  };
};

/* -------------------------- API functions ------------------------- */
/* (Move these to a separate file in real apps) */

type CreateProjectInput = {
  name: string;
  description?: string;
};

type UpdateProjectInput = {
  id: string;
  name: string;
  description?: string;
};

async function createProject(data: CreateProjectInput) {
  await new Promise((res) => setTimeout(res, 500));
  return data;
}

async function updateProject(data: UpdateProjectInput) {
  await new Promise((res) => setTimeout(res, 500));
  return data;
}

/* --------------------------- Component ---------------------------- */

export default function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description ?? "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [project, reset]);

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onOpenChange(false);
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    if (project) {
      updateMutation.mutate({
        id: project.id,
        ...values,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create Project"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Input
              placeholder="Project name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Description (optional)"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {project ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function useForm<T>(arg0: { resolver: any; defaultValues: { name: string; description: string; }; }): { register: any; handleSubmit: any; reset: any; formState: { errors: any; }; } {
    throw new Error("Function not implemented.");
}

function zodResolver(projectSchema: z.ZodObject<{ name: z.ZodString; description: z.ZodOptional<z.ZodString>; }, z.core.$strip>) {
    throw new Error("Function not implemented.");
}

