export interface LoginResponseDTO {
  token: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatarUrl?: string;
    isActive: boolean;
  };
}
