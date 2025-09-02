import type { UserDTO } from "../../models/users/UserDto";

const dummyUser: UserDTO = {
    id: "u-123",
    Firstname: "Jane",
    Lastname: "Doe",
    EmailAddress: "jane.doe@example.com",
    AvatarUrl: "", 
    PasswordHash: "hashed_password",
    CreatedAt: new Date("2024-01-01T08:00:00Z"),
    IsActive: true,
};

export const userAPI = {
    getCurrentUser: async (): Promise<UserDTO> => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const user: UserDTO = {
                ...dummyUser,
                CreatedAt: new Date(dummyUser.CreatedAt), 
            };

            return user;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    },
};
