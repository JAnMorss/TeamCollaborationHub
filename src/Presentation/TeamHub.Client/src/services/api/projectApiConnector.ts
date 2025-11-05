import axios from "axios";
import type { PaginatedResult } from "../../models/projects/PaginatedResult";
import type { ProjectMemberRequest } from "../../models/projects/ProjectMemberRequest";
import type { ProjectMemberResponse } from "../../models/projects/ProjectMemberResponse";
import type { ProjectRequest } from "../../models/projects/ProjectRequest";
import type { ProjectResponse } from "../../models/projects/ProjectResponse";
import type { ApiResponse } from "../../models/users/ApiResponse";

const API_BASE_URL = "http://localhost:8080/api/v1/project";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized - No token found");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function getAllProjects(queryParams?: Record<string, any>): Promise<PaginatedResult<ProjectResponse>> {
  const response = await axios.get<ApiResponse<PaginatedResult<ProjectResponse>>>(API_BASE_URL, {
    headers: getAuthHeaders(),
    params: queryParams,
  });
  return response.data.data;
}

export async function getProjectById(id: string): Promise<ProjectResponse> {
  const response = await axios.get<ApiResponse<ProjectResponse>>(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function searchProjectsByName(name: string, queryParams?: Record<string, any>): Promise<PaginatedResult<ProjectResponse>> {
  const response = await axios.get<ApiResponse<PaginatedResult<ProjectResponse>>>(`${API_BASE_URL}/search`, {
    headers: getAuthHeaders(),
    params: { name, ...queryParams },
  });
  return response.data.data;
}

export async function createProject(request: ProjectRequest): Promise<ProjectResponse> {
  const response = await axios.post<ApiResponse<ProjectResponse>>(API_BASE_URL, request, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function updateProject(id: string, request: ProjectRequest): Promise<ProjectResponse> {
  const response = await axios.put<ApiResponse<ProjectResponse>>(`${API_BASE_URL}/${id}/details`, request, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function deleteProject(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
}

export async function getAllProjectMembers(queryParams?: Record<string, any>): Promise<PaginatedResult<ProjectMemberResponse>> {
  const response = await axios.get<ApiResponse<PaginatedResult<ProjectMemberResponse>>>(`http://localhost:8080/api/projects/members`, {
    headers: getAuthHeaders(),
    params: queryParams,
  });
  return response.data.data;
}

export async function getAllMembersOfProject(projectId: string, queryParams?: Record<string, any>): Promise<PaginatedResult<ProjectMemberResponse>> {
  const response = await axios.get<ApiResponse<PaginatedResult<ProjectMemberResponse>>>(`${API_BASE_URL}/${projectId}/members`, {
    headers: getAuthHeaders(),
    params: queryParams,
  });
  return response.data.data;
}

export async function addProjectMember(projectId: string, request: ProjectMemberRequest): Promise<ProjectMemberResponse> {
  const response = await axios.post<ApiResponse<ProjectMemberResponse>>(`http://localhost:8080/api/projects/${projectId}/members`, request, {
    headers: getAuthHeaders(),
  });
  return response.data.data;
}

export async function removeProjectMember(projectId: string, request: ProjectMemberRequest): Promise<void> {
  await axios.delete(`http://localhost:8080/api/projects/${projectId}/members`, {
    headers: getAuthHeaders(),
    data: request,
  });
}
