import { z } from "zod";

export const validationErrorItemSchema = z.object({
  propertyName: z.string(),
  errorMessage: z.string(),
});

export const validationErrorResponseSchema = z.object({
  type: z.literal("ValidationFailure"),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
  errors: z.array(validationErrorItemSchema),
});

export type ValidationErrorResponse = z.infer<
  typeof validationErrorResponseSchema
>;

export const taskAttachmentSchema = z.object({
  id: z.string(),
  taskId: z.string().optional(),
  fileName: z.string(),
  filePath: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  uploadedAt: z.string(),
  uploadedById: z.string().optional(),
  uploadedBy: z.string().nullable().optional(),
});

export type TaskAttachment = z.infer<typeof taskAttachmentSchema>;

export const taskAttachmentsSchema = z.union([
  z.string(),
  z.array(taskAttachmentSchema).optional(),
]);

export const taskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  projectName: z.string().nullable(),

  createdById: z.string(),
  createdBy: z.string().nullable(),

  assignedToId: z.string().nullable(),
  assignedTo: z.string().nullable(),

  title: z.string(),
  description: z.string(),

  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Todo", "InProgress", "Review", "Completed"]),

  dueDate: z.string().nullable(),
  createdAt: z.string(),

  comments: z.any(),

  attachments: taskAttachmentsSchema,
});

export type Task = z.infer<typeof taskSchema>;

export const paginatedResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    totalCount: z.number(),
    page: z.number(),
    pageSize: z.number(),
  });

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string(),
  });

export const getAllTasksResponseSchema = apiResponseSchema(
  paginatedResultSchema(taskSchema)
);
export type GetAllTasksResponse = z.infer<typeof getAllTasksResponseSchema>;

export const getTaskByIdResponseSchema = apiResponseSchema(taskSchema);
export type GetTaskByIdResponse = z.infer<typeof getTaskByIdResponseSchema>;

export const taskRequestSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Todo", "InProgress", "Review", "Completed"]),
  dueDate: z.string().nullable(),
});

export type TaskRequest = z.infer<typeof taskRequestSchema>;

export const createUpdateTaskResponseSchema = apiResponseSchema(taskSchema);
export type CreateUpdateTaskResponse = z.infer<
  typeof createUpdateTaskResponseSchema
>;

export const assignedTasksResponseSchema = apiResponseSchema(z.array(taskSchema));
export type AssignedTasksResponse = z.infer<typeof assignedTasksResponseSchema>;

export const assignTaskRequestSchema = z.object({
  userId: z.string(),
});
export type AssignTaskRequest = z.infer<typeof assignTaskRequestSchema>;

export const assignTaskResponseSchema = z.object({
  message: z.string(),
});
export type AssignTaskResponse = z.infer<typeof assignTaskResponseSchema>;

export const unassignTaskResponseSchema = z.object({
  message: z.string(),
});
export type UnassignTaskResponse = z.infer<typeof unassignTaskResponseSchema>;

export const uploadTaskAttachmentResponseSchema = apiResponseSchema(taskAttachmentSchema);
export type UploadTaskAttachmentResponse = z.infer<typeof uploadTaskAttachmentResponseSchema>;

export const removeTaskAttachmentResponseSchema = z.object({
  message: z.string(),
});
export type RemoveTaskAttachmentResponse = z.infer<typeof removeTaskAttachmentResponseSchema>;

export const createUpdateTaskApiResponseSchema = z.union([
  createUpdateTaskResponseSchema,
  validationErrorResponseSchema,
]);

export const assignTaskApiResponseSchema = z.union([
  assignTaskResponseSchema,
  validationErrorResponseSchema,
]);

export const removeTaskAttachmentApiResponseSchema = z.union([
  removeTaskAttachmentResponseSchema,
  validationErrorResponseSchema,
]);
