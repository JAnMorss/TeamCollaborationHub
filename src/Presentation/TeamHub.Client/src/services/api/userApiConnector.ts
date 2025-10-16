import axios from "axios";
import type { UserProfileDTO } from "../../models/users/UserProfileDTO";
import type { ApiResponse } from "../../models/users/ApiResponse";

const API_BASE_URL = "http://localhost:8080/api/user";

export async function getMyProfile(): Promise<UserProfileDTO> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      throw new Error("Unauthorized");
    }

    const response = await axios.get<ApiResponse<UserProfileDTO>>(
      `${API_BASE_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
}
