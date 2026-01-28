import { z } from "zod";

const UserRoleEnum = z.enum(["User", "Admin"]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  role: UserRoleEnum,
  email: z.string().email(),
  avatar: z.string().url().nullable(),
  isActive: z.boolean(),
  updatedAt: z
    .string()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid datetime",
    }),
  identityId: z.string().uuid(),
});


export const GetMyProfileResponseSchema = z.object({
  data: UserSchema,
  message: z.string(),
});

export const UsersListSchema = z.object({
  data: z.object({
    items: z.array(UserSchema),
    totalCount: z.number(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
  }),
  message: z.string(),
});

export const UserUpdateDetailsInputSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty."),
  lastName: z.string().min(1, "Last name cannot be empty."),
  email: z.string().email("Invalid email format."),
});

export const UserUpdateDetailsResponseSchema = GetMyProfileResponseSchema;

export const GetUserAvatarResponseSchema = z.object({
  data: z.object({
    avatarUrl: z.string().url(),
    imageBytes: z.string(),      
    contentType: z.string(),
  }),
  message: z.string(),
});
