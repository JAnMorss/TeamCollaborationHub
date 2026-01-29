import {
  getAllProjectsResponseSchema,
  getProjectByIdResponseSchema,
  projectRequestSchema,
  projectMembersResponseSchema,
  addProjectMemberRequestSchema,
  removeMemberApiResponseSchema,
  projectApiResponseSchema,
  addMemberApiResponseSchema,
  type GetAllProjectsResponse,
  type GetProjectByIdResponse,
  type CreateUpdateProjectResponse,
  type ProjectMembersResponse,
  type AddProjectMemberResponse,
  type RemoveProjectMemberResponse,
  type ValidationErrorResponse,
} from "@/schemas/projects/project.schema";

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
  type AxiosResponse,
} from "axios";

// Base URL now includes /v1
const BASE_URL = "http://localhost:8080/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
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

export const projectsApiConnector = {
  getAllProjects: async (): Promise<GetAllProjectsResponse> => {
    const response = await api.get("/project");
    return getAllProjectsResponseSchema.parse(response.data);
  },

  getProjectById: async (projectId: string): Promise<GetProjectByIdResponse> => {
    const response = await api.get(`/project/${projectId}`);
    return getProjectByIdResponseSchema.parse(response.data);
  },

  createProject: async (
    data: unknown
  ): Promise<CreateUpdateProjectResponse | ValidationErrorResponse> => {
    const validData = projectRequestSchema.parse(data);
    const response = await api.post("/project", validData);
    return projectApiResponseSchema.parse(response.data);
  },

  updateProject: async (
    projectId: string,
    data: unknown
  ): Promise<CreateUpdateProjectResponse | ValidationErrorResponse> => {
    const validData = projectRequestSchema.parse(data);
    const response = await api.put(`/project/${projectId}/details`, validData);
    return projectApiResponseSchema.parse(response.data);
  },

  removeProject: async (
    projectId: string
  ): Promise<{ message: string } | ValidationErrorResponse> => {
    const response = await api.delete(`/project/${projectId}`);
    return response.data;
  },

  getAllProjectMembers: async (
    query?: { page?: number; pageSize?: number }
  ): Promise<ProjectMembersResponse> => {
    const response = await api.get("/project/members", { params: query });
    return projectMembersResponseSchema.parse(response.data);
  },

  addProjectMember: async (
    projectId: string,
    data: unknown
  ): Promise<AddProjectMemberResponse | ValidationErrorResponse> => {
    const validData = addProjectMemberRequestSchema.parse(data);
    const response = await api.post(`/project/${projectId}/members`, validData);
    return addMemberApiResponseSchema.parse(response.data);
  },

  removeProjectMember: async (
  projectId: string,
  userId: string
): Promise<RemoveProjectMemberResponse | ValidationErrorResponse> => {
  const response = await api.delete(`/project/${projectId}/members/${userId}`);
  return removeMemberApiResponseSchema.parse(response.data);
},

};
