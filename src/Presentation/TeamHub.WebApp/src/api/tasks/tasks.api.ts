import {
  getAllTasksResponseSchema,
  getTaskByIdResponseSchema,
  taskRequestSchema,
  createUpdateTaskApiResponseSchema,
  assignedTasksResponseSchema,
  assignTaskRequestSchema,
  assignTaskApiResponseSchema,
  unassignTaskResponseSchema,
  uploadTaskAttachmentResponseSchema,
  removeTaskAttachmentApiResponseSchema,
  type GetAllTasksResponse,
  type GetTaskByIdResponse,
  type CreateUpdateTaskResponse,
  type AssignedTasksResponse,
  type AssignTaskResponse,
  type UnassignTaskResponse,
  type UploadTaskAttachmentResponse,
  type RemoveTaskAttachmentResponse,
  type ValidationErrorResponse,
} from "@/schemas/tasks/task.schema";
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosHeaders, type AxiosResponse } from "axios";

const BASE_URL = "http://localhost:8080/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) config.headers = new AxiosHeaders();
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error)
);

export const tasksApiConnector = {
  getAllTasks: async (): Promise<GetAllTasksResponse> => {
    const response = await api.get("/task");
    const parsed = getAllTasksResponseSchema.parse(response.data);

    parsed.data.items = parsed.data.items.map((task) => ({
      ...task,
      attachments:
        task.attachments === "" || task.attachments === null
          ? []
          : Array.isArray(task.attachments)
          ? task.attachments
          : [],
    }));

    return parsed;
  },

  getTaskById: async (taskId: string): Promise<GetTaskByIdResponse> => {
    const response = await api.get(`/task/${taskId}`);
    const parsed = getTaskByIdResponseSchema.parse(response.data);

    parsed.data.attachments =
      parsed.data.attachments === "" || parsed.data.attachments === null
        ? []
        : Array.isArray(parsed.data.attachments)
        ? parsed.data.attachments
        : [];

    return parsed;
  },

  getTasksByProjectId: async (projectId: string): Promise<GetAllTasksResponse> => {
    const response = await api.get(`/task/by-project/${projectId}`);
    const parsed = getAllTasksResponseSchema.parse(response.data);

    parsed.data.items = parsed.data.items.map((task) => ({
      ...task,
      attachments:
        task.attachments === "" || task.attachments === null
          ? []
          : Array.isArray(task.attachments)
          ? task.attachments
          : [],
    }));

    return parsed;
  },

  createTask: async (data: unknown): Promise<CreateUpdateTaskResponse | ValidationErrorResponse> => {
    const validData = taskRequestSchema.parse(data);
    const response = await api.post("/task", validData);
    return createUpdateTaskApiResponseSchema.parse(response.data);
  },

  updateTask: async (taskId: string, data: unknown): Promise<CreateUpdateTaskResponse | ValidationErrorResponse> => {
    const validData = taskRequestSchema.parse(data);
    const response = await api.put(`/task/${taskId}/details`, validData);
    return createUpdateTaskApiResponseSchema.parse(response.data);
  },

  deleteTask: async (taskId: string): Promise<{ message: string } | ValidationErrorResponse> => {
    const response = await api.delete(`/task/${taskId}`);
    return removeTaskAttachmentApiResponseSchema.parse(response.data);
  },

  getAssignedTasks: async (): Promise<AssignedTasksResponse> => {
    const response = await api.get("/task/assigned");
    const parsed = assignedTasksResponseSchema.parse(response.data);

    parsed.data = parsed.data.map((task) => ({
      ...task,
      attachments:
        task.attachments === "" || task.attachments === null
          ? []
          : Array.isArray(task.attachments)
          ? task.attachments
          : [],
    }));

    return parsed;
  },

  assignTask: async (taskId: string, data: unknown): Promise<AssignTaskResponse | ValidationErrorResponse> => {
    const validData = assignTaskRequestSchema.parse(data);
    const response = await api.put(`/task/${taskId}/assign`, validData);
    return assignTaskApiResponseSchema.parse(response.data);
  },

  unassignTask: async (taskId: string): Promise<UnassignTaskResponse | ValidationErrorResponse> => {
    const response = await api.put(`/task/${taskId}/unassign`);
    return unassignTaskResponseSchema.parse(response.data);
  },

  uploadTaskAttachment: async (taskId: string, file: File): Promise<UploadTaskAttachmentResponse | ValidationErrorResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/task/${taskId}/attachments/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return uploadTaskAttachmentResponseSchema.parse(response.data);
  },

  downloadTaskAttachment: async (attachmentId: string): Promise<Blob> => {
    const response = await api.get(`/task/attachments/${attachmentId}/download`, { responseType: "blob" });
    return response.data;
  },

  removeTaskAttachment: async (attachmentId: string): Promise<RemoveTaskAttachmentResponse | ValidationErrorResponse> => {
    const response = await api.delete(`/task/attachments/${attachmentId}/remove`);
    return removeTaskAttachmentApiResponseSchema.parse(response.data);
  },
};
