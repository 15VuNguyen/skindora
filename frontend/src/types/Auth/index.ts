export const RoleEnum = { User: 0, Staff: 1, Admin: 2 } as const;
export type RoleEnumType = (typeof RoleEnum)[keyof typeof RoleEnum];

export const UserVerifyStatus = { Unverified: 0, Verified: 1, Banned: 2 } as const;
export type UserVerifyStatusType = (typeof UserVerifyStatus)[keyof typeof UserVerifyStatus];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN" | "STAFF";
  isVerified: boolean;
  username?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  location?: string;
}
export interface BackendErrorPayload {
  message: string;
  errors?: Record<string, { msg: string }>;
  errorInfor?: unknown;
}
