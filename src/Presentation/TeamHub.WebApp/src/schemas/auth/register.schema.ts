import { z } from "zod";

export const registerRequestSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name cannot be empty."),
  lastName: z
    .string()
    .min(1, "Last name cannot be empty."),
  email: z
    .string()
    .min(1, "Email cannot be empty.")
    .email("Invalid email format."),
  password: z
    .string()
    .min(1, "Password cannot be empty.")
    .min(6, "Password must be at least 6 characters long."),
});

export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;

export const registerSuccessResponseSchema = z.object({
  data: z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    role: z.string(),
    email: z.string().email(),
    avatar: z.string().nullable(),
    isActive: z.boolean(),
    updatedAt: z.string().nullable(),
    identityId: z.string().uuid(),
  }),
  message: z.string(),
});

export type RegisterSuccessResponse = z.infer<
  typeof registerSuccessResponseSchema
>;

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

export const registerApiResponseSchema = z.union([
  registerSuccessResponseSchema,
  validationErrorResponseSchema,
]);

export type RegisterApiResponse = z.infer<
  typeof registerApiResponseSchema
>;
