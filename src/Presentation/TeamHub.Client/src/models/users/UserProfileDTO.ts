export interface UserProfileDTO {
  id: string;
  identityId: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}
