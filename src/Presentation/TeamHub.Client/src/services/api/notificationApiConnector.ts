import type { NotificationDTO } from "../../models/notifications/NotificationDTO";

const dummyNotifications: NotificationDTO[] = [
  {
    id: "1",
    title: "Task Assigned",
    message: 'Sarah assigned you to "Design System"',
    type: "TaskAssigned",
    isRead: false,
    time: "2 min ago",
  },
  {
    id: "2",
    title: "Comment Added",
    message: 'John commented on "Bug fix: Navbar"',
    type: "CommentAdded",
    isRead: false,
    time: "15 min ago",
  },
  {
    id: "3",
    title: "Task Completed",
    message: 'Alex completed task "Update Pricing"',
    type: "TaskCompleted",
    isRead: true,
    time: "1 hour ago",
  },
  {
    id: "4",
    title: "Project Member Added",
    message: 'New member "Sam" joined the project',
    type: "ProjectMemberAdded",
    isRead: true,
    time: "Yesterday",
  },
];

export const notificationAPI = {
  getNotifications: async (): Promise<NotificationDTO[]> => {
    await new Promise((res) => setTimeout(res, 300));
    return dummyNotifications;
  },
};
