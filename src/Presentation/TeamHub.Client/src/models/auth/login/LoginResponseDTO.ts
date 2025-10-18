export interface LoginResponseDTO {
  data: {
    token: string;
    refreshToken: string;
  };
  message: string;
}
