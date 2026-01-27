import {
  UserSchema,
  GetMyProfileResponseSchema,
  UsersListSchema,
  UserUpdateDetailsInputSchema,
  UserUpdateDetailsResponseSchema,
  GetUserAvatarResponseSchema,
} from "@/schemas/users/user.schema";
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosHeaders, type AxiosResponse } from "axios";
import type { z } from "zod";

type User = z.infer<typeof UserSchema>;
type GetMyProfileResponse = z.infer<typeof GetMyProfileResponseSchema>["data"];
type UsersListResponse = z.infer<typeof UsersListSchema>["data"];
type UserUpdateResponse = z.infer<typeof UserUpdateDetailsResponseSchema>["data"];
type UserAvatarResponse = z.infer<typeof GetUserAvatarResponseSchema>["data"];

const BASE_URL = "http://localhost:8080/api/v1/users";

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
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const userApiConnector = {
  getMyProfile: async (): Promise<GetMyProfileResponse> => {
    const response = await api.get("/me");
    return GetMyProfileResponseSchema.parse(response.data).data;
  },

  getAllUsers: async (page = 1, pageSize = 10): Promise<UsersListResponse> => {
    const response = await api.get("/", { params: { page, pageSize } });
    return UsersListSchema.parse(response.data).data;
  },

  searchUsers: async (name: string, page = 1, pageSize = 10): Promise<UsersListResponse> => {
    const response = await api.get("/searchUsers", { params: { name, page, pageSize } });
    return UsersListSchema.parse(response.data).data;
  },

  updateUserDetails: async (data: unknown): Promise<UserUpdateResponse> => {
    const validData = UserUpdateDetailsInputSchema.parse(data);
    const response = await api.put("/details", validData);
    return UserUpdateDetailsResponseSchema.parse(response.data).data;
  },

  getUserAvatar: async (): Promise<UserAvatarResponse> => {
    const response = await api.get("/avatar");
    return GetUserAvatarResponseSchema.parse(response.data).data;
  },

  updateUserAvatar: async (file: File): Promise<UserAvatarResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.put("/updateAvatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return GetUserAvatarResponseSchema.parse(response.data).data;
  },

  activateUser: async (): Promise<void> => {
    await api.put("/activate");
  },

  deactivateUser: async (): Promise<void> => {
    await api.put("/deactivate");
  },
};
