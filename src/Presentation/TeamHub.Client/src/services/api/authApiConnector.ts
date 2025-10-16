import axios, { type AxiosResponse } from "axios";
import type { LoginRequestDTO } from "../../models/auth/login/LoginRequestDTO";
import type { LoginResponseDTO } from "../../models/auth/login/LoginResponseDTO";
import type { RegisterRequestDTO } from "../../models/auth/register/RegisterRequestDTO";
import type { RegisterResponseDTO } from "../../models/auth/register/RegisterResponseDTO ";

const BASE_URL = "http://localhost:8080/api/Auth";

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

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token saved to localStorage:", token);
      } else {
        console.warn("No token found in login response");
      }

      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    console.log("Token removed from localStorage");
  },
};
