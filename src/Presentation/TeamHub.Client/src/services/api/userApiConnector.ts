import axios from "axios";
import type { UserProfileDTO } from "../../models/users/UserProfileDTO";
import type { ApiResponse } from "../../models/users/ApiResponse";

const API_BASE_URL = "http://localhost:8080/api/user";

export async function getMyProfile(): Promise<UserProfileDTO> {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("Unauthorized - No token found");
    }

    const response = await axios.get<ApiResponse<any>>(`${API_BASE_URL}/me`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    console.log("✅ Profile fetched successfully:", response.data);

    const rawData = response.data.data;

    const user: UserProfileDTO = {
      id: rawData.id,
      identityId: rawData.identityId,
      fullName: rawData.fullName,
      email: rawData.email,
      avatar: rawData.avatar,
      role: rawData.role,
      isActive: rawData.isActive,
      createdAt: rawData.createdAt ?? "",
      updatedAt: rawData.updatedAt,
    };

    return user;
  } catch (error: any) {
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    
    throw error;
  }
}