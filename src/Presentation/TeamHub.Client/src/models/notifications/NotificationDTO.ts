export interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  type:
    | "TaskAssigned"
    | "TaskCompleted"
    | "CommentAdded"
    | "ProjectMemberAdded"
    | "TaskDueReminder"
    | "TaskMoved";
  isRead: boolean;
  time: string; 
}
