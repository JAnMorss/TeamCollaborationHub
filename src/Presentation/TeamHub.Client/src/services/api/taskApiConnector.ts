import axios from "axios";
import type { AssignTaskRequest } from "../../models/tasks/AssignTaskRequest";
import type { TaskAttachmentResponse } from "../../models/tasks/TaskAttachmentResponse";
import type { TaskRequest } from "../../models/tasks/TaskRequest";
import type { TaskResponse } from "../../models/tasks/TaskResponse";
import type { ApiResponse } from "../../models/users/ApiResponse";

const BASE_URL = "http://localhost:8080/api/v1/task";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized - No token found");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function getAllTasks(queryParams?: Record<string, any>): Promise<TaskResponse[]> {
  const response = await axios.get<ApiResponse<{ items: TaskResponse[] }>>(BASE_URL, {
    headers: getAuthHeaders(),
    params: queryParams,
  });
  return response.data.data.items;
}

export async function getTaskById(id: string): Promise<TaskResponse> {
  const response = await axios.get<ApiResponse<TaskResponse>>(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function getTasksByProjectId(projectId: string): Promise<TaskResponse[]> {
  const response = await axios.get<ApiResponse<TaskResponse[]>>(`${BASE_URL}/by-project/${projectId}`, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function getTasksByAssignedUser(): Promise<TaskResponse[]> {
  const response = await axios.get<ApiResponse<TaskResponse[]>>(`${BASE_URL}/assigned`, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function createTask(task: TaskRequest): Promise<TaskResponse> {
  const response = await axios.post<ApiResponse<TaskResponse>>(BASE_URL, task, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function updateTask(id: string, task: TaskRequest): Promise<TaskResponse> {
  const response = await axios.put<ApiResponse<TaskResponse>>(`${BASE_URL}/${id}/details`, task, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
}

export const assignTask = async (taskId: string, payload: AssignTaskRequest) => {
  try {
    const response = await axios.put<ApiResponse<TaskResponse>>(
      `${BASE_URL}/${taskId}/assign`,
      payload,
      {
        headers: getAuthHeaders(), 
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to assign task:", error.response?.data || error.message);
    throw error;
  }
};


export async function unassignTask(taskId: string): Promise<TaskResponse> {
  const response = await axios.put<ApiResponse<TaskResponse>>(`${BASE_URL}/${taskId}/unassign`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function uploadAttachment(taskId: string, formData: FormData): Promise<TaskAttachmentResponse> {
  const response = await axios.post<ApiResponse<TaskAttachmentResponse>>(
    `${BASE_URL}/${taskId}/attachments/upload`,
    formData,
    {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    }
  );
  return response.data.data;
}

export async function downloadAttachment(attachmentId: string): Promise<Blob> {
  const response = await axios.get(`${BASE_URL}/attachments/${attachmentId}/download`, {
    headers: getAuthHeaders(),
    responseType: "blob",
  });
  return response.data;
}

export async function removeAttachment(attachmentId: string): Promise<void> {
  await axios.delete(`${BASE_URL}/attachments/${attachmentId}/remove`, {
    headers: getAuthHeaders(),
  });
}
