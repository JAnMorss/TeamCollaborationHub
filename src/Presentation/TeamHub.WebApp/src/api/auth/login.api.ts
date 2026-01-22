import {
  loginRequestSchema,
  loginApiResponseSchema,
  type LoginApiResponse,
} from "@/schemas/auth/login.schema";

import axios, { 
    AxiosHeaders,
    type AxiosInstance, 
    type AxiosRequestConfig,
    type AxiosResponse, 
    type InternalAxiosRequestConfig
} from "axios";

const BASE_URL = "http://localhost:8080/api/v1/auth";

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
  async (error) => Promise.reject(error)
);

export const loginApiConnector = {
  login: async (data: unknown): Promise<LoginApiResponse> => {
    const validRequest = loginRequestSchema.parse(data);

    try {
      const response = await api.post("/login", validRequest);

      const parsedResponse =
        loginApiResponseSchema.parse(response.data);

      if ("data" in parsedResponse) {
        const { token, refreshToken } = parsedResponse.data;
        localStorage.setItem("token", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }

      return parsedResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      }
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  get: async <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.get(url, config);
    return response.data;
  },

  post: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.post(url, data, config);
    return response.data;
  },
};
