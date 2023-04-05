import { User } from '../entities/user.entity';

export enum ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPPORT = 'SUPPORT',
  BUSINESS = 'BUSINESS',
  ORGANIZER_ADMIN = 'ORGANIZER_ADMIN',
  ORGANIZER_USER = 'ORGANIZER_USER',
}

export const CELICA_STAFF_ROLES: ROLE[] = [
  ROLE.SUPER_ADMIN,
  ROLE.SUPPORT,
  ROLE.SUPPORT,
  ROLE.BUSINESS,
];

export const ORGANIZER_STAFF_ROLE = [ROLE.ORGANIZER_ADMIN];

export interface UserRole {
  role: ROLE;
  user: string | User;
  assignedBy: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
