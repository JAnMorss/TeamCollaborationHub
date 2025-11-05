import axios, { type AxiosResponse } from "axios";
import type { LoginRequestDTO } from "../../models/auth/login/LoginRequestDTO";
import type { LoginResponseDTO } from "../../models/auth/login/LoginResponseDTO";
import type { RegisterRequestDTO } from "../../models/auth/register/RegisterRequestDTO";
import type { RegisterResponseDTO } from "../../models/auth/register/RegisterResponseDTO ";

const BASE_URL = "http://localhost:8080/api/v1/auth";

export const authApiConnector = {
  register: async (data: RegisterRequestDTO): Promise<RegisterResponseDTO> => {
    try {
      const response: AxiosResponse<RegisterResponseDTO> = await axios.post(
        `${BASE_URL}/register`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },

  login: async (data: LoginRequestDTO): Promise<LoginResponseDTO> => {
    try {
      const response: AxiosResponse<LoginResponseDTO> = await axios.post(
        `${BASE_URL}/login`,
        data
      );

      const { token, refreshToken } = response.data.data || {};
      
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken || "");
      
        const savedToken = localStorage.getItem("token");
        const savedRefreshToken = localStorage.getItem("refreshToken");
        
        console.log("✅ Verification - Token saved:", !!savedToken);
        console.log("✅ Verification - RefreshToken saved:", !!savedRefreshToken);
      } else {
        console.warn("⚠️ No token found in login response");
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("📛 Axios error details:", error.response?.data);
      }
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};
