import axios from "axios";

import {
  registerRequestSchema,
  registerApiResponseSchema,
  type RegisterApiResponse,
} from "@/schemas/auth/register.schema";

const BASE_URL = "http://localhost:8080/api/v1/auth";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerApiConnector = {
  register: async (data: unknown): Promise<RegisterApiResponse> => {
    const validRequest = registerRequestSchema.parse(data);

    try {
      const response = await api.post("/register", validRequest);
      return registerApiResponseSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return registerApiResponseSchema.parse(error.response.data);
      }
      throw error;
    }
  },
};
