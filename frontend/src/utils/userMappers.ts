import type { DetailedUserFromApi } from "@/services/authService";
import { RoleEnum, type User, UserVerifyStatus } from "@/types/auth";

export const mapBackendUserToFrontendUser = (apiUser: DetailedUserFromApi): User => {
  let roleString: "USER" | "ADMIN" | "STAFF" = "USER";
  const roleIdAsNumber = Number(apiUser.roleid);
  if (roleIdAsNumber === RoleEnum.Admin) {
    roleString = "ADMIN";
  } else if (roleIdAsNumber === RoleEnum.Staff) {
    roleString = "STAFF";
  }

  const verifyStatusAsNumber = Number(apiUser.verify);

  return {
    id: apiUser._id,
    email: apiUser.email,
    firstName: apiUser.first_name || "",
    lastName: apiUser.last_name || "",
    fullName: `${apiUser.first_name || "BUGGER"} ${apiUser.last_name || ""}`.trim() || apiUser.name || apiUser.email,
    role: roleString,
    isVerified: verifyStatusAsNumber === UserVerifyStatus.Verified,
    username: apiUser.username,
    avatar: apiUser.avatar,
    location: apiUser.location || "BUGGER",
    createdAt: apiUser.created_at || "BUGGER",
    updatedAt: apiUser.updated_at || "BUGGER",
    phone: apiUser.phone_number || "BUGGER",
  };
};
