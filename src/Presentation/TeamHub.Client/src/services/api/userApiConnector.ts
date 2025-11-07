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

export async function getAllUsers(params?: { search?: string; page?: number; pageSize?: number }) {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const response = await axios.get<ApiResponse<any>>(
      `${API_BASE_URL}?${queryParams.toString()}`,
      { headers: authHeaders() }
    );

    console.log("✅ Users fetched successfully:", response.data);

    return response.data.data; 
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    throw error;
  }
}

export async function searchUsers(keyword: string) {
  return getAllUsers({ search: keyword, page: 1, pageSize: 10 });
}
