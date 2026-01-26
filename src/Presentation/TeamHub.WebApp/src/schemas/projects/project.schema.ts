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

export type ValidationErrorResponse = z.infer<typeof validationErrorResponseSchema>;

export const projectMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fullName: z.string(),
  role: z.string(),
  joinedAt: z.string(),
});

export type ProjectMember = z.infer<typeof projectMemberSchema>;

export const projectMembersUnionSchema = z.union([
  z.array(projectMemberSchema),
  z.string(),
]);

export const projectSchema = z.object({
  id: z.string(),
  createdById: z.string(),
  createdBy: z.string().nullable(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  isActive: z.boolean(),
  isArchived: z.boolean(),
  updatedAt: z.string().nullable(),
  members: projectMembersUnionSchema,
});

export type Project = z.infer<typeof projectSchema>;

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

export const getAllProjectsResponseSchema = apiResponseSchema(
  paginatedResultSchema(projectSchema)
);

export type GetAllProjectsResponse = z.infer<typeof getAllProjectsResponseSchema>;

export const getProjectByIdResponseSchema = apiResponseSchema(projectSchema);

export type GetProjectByIdResponse = z.infer<typeof getProjectByIdResponseSchema>;

export const projectRequestSchema = z.object({
  name: z.string().min(1, "Project name cannot be empty."),
  description: z.string().min(1, "Project description cannot be empty."),
  color: z
    .string()
    .min(1, "Project color cannot be empty.")
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Project color must be a valid hex color code."),
});

export type ProjectRequest = z.infer<typeof projectRequestSchema>;

export const createUpdateProjectResponseSchema = apiResponseSchema(projectSchema);

export type CreateUpdateProjectResponse = z.infer<
  typeof createUpdateProjectResponseSchema
>;

export const projectMembersResponseSchema = apiResponseSchema(
  paginatedResultSchema(projectMemberSchema)
);

export type ProjectMembersResponse = z.infer<typeof projectMembersResponseSchema>;

export const addProjectMemberRequestSchema = z.object({
  userId: z.string(),
});

export type AddProjectMemberRequest = z.infer<typeof addProjectMemberRequestSchema>;

export const addProjectMemberResponseSchema = apiResponseSchema(projectMemberSchema);

export type AddProjectMemberResponse = z.infer<typeof addProjectMemberResponseSchema>;

export const removeProjectMemberResponseSchema = z.object({
  message: z.string(),
});

export type RemoveProjectMemberResponse = z.infer<typeof removeProjectMemberResponseSchema>;

export const projectApiResponseSchema = z.union([
  createUpdateProjectResponseSchema,
  validationErrorResponseSchema,
]);

export const addMemberApiResponseSchema = z.union([
  addProjectMemberResponseSchema,
  validationErrorResponseSchema,
]);

export const removeMemberApiResponseSchema = z.union([
  removeProjectMemberResponseSchema,
  validationErrorResponseSchema,
]);
