export interface UserDTO{
    id: string;
    Firstname: string;
    Lastname: string;
    EmailAddress: string;
    AvatarUrl?: string;
    PasswordHash: string;
    CreatedAt: Date;
    IsActive: boolean;
}