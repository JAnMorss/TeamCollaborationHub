export interface UserProfileDTO {
  id: string;
  identityId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string; 
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}