import type { UserProfileDTO } from "./UserProfileDTO";

export interface SearchUsersResponse {
  items: UserProfileDTO[];
  totalCount?: number;
}