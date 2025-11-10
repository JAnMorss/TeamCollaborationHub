import axios from "axios";
import type { UserProfileDTO } from "../../models/users/UserProfileDTO";
import type { ApiResponse } from "../../models/users/ApiResponse";

const API_BASE_URL = "http://localhost:8080/api/v1/users";

function authHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized - No token found");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getMyProfile(): Promise<UserProfileDTO> {
  try {
    const response = await axios.get<ApiResponse<any>>(`${API_BASE_URL}/me`, {
      headers: authHeaders(),
    });

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

export async function getUserAvatar(): Promise<string | null> {
  try {
    const response = await axios.get<ApiResponse<any>>(`${API_BASE_URL}/avatar`, {
      headers: authHeaders(),
    });

    const { data } = response.data;
    if (!data) return null;

    if (data.imageBytes) {
      return `data:${data.contentType};base64,${data.imageBytes}`;
    }

    return data.avatarUrl || null;
  } catch (error) {
    console.error("❌ Error fetching user avatar:", error);
    return null;
  }
}

export async function searchUsers(keyword: string) {
  return getAllUsers({ search: keyword, page: 1, pageSize: 10 });
}

function getAllUsers(arg0: { search: string; page: number; pageSize: number; }) {
  throw new Error("Function not implemented.");
}

