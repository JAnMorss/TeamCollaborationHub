import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email cannot be empty.")
    .email("Invalid email format."),
  password: z
    .string()
    .min(1, "Password cannot be empty.")
    .min(6, "Password must be at least 6 characters long."),
});

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;

export const loginSuccessResponseSchema = z.object({
  data: z.object({
    token: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string(),
});

export type LoginSuccessResponse = z.infer<
  typeof loginSuccessResponseSchema
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

export const invalidCredentialsResponseSchema = z.object({
  type: z.literal("User.InvalidCredentials"),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
  errors: z.array(validationErrorItemSchema).nullable(),
});

export type InvalidCredentialsResponse = z.infer<
  typeof invalidCredentialsResponseSchema
>;

export const loginApiResponseSchema = z.union([
  loginSuccessResponseSchema,
  validationErrorResponseSchema,
  invalidCredentialsResponseSchema,
]);

export type LoginApiResponse = z.infer<typeof loginApiResponseSchema>;
