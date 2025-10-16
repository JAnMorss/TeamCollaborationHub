export interface RegisterResponseDTO {
  id: string;
  Firstname: string;
  Lastname: string;
  EmailAddress: string;
  CreatedAt: string | Date; 
  IsActive: boolean;
  Token?: string; 
}