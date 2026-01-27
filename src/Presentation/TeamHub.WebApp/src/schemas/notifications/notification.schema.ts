import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  isRead: z.boolean(),
  createdAt: z.string().datetime(),
});

export const NotificationsListSchema = z.object({
  data: z.array(NotificationSchema),
  message: z.string(),
});

export type NotificationDTO = z.infer<typeof NotificationSchema>;
