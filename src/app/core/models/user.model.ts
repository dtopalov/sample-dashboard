import { Team } from './team.model';

export type UserRole = 'Admin' | 'Manager' | 'User';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  email: string;
  phone: string;
  teams: Team[];
  role: UserRole;
  status: UserStatus;
}
