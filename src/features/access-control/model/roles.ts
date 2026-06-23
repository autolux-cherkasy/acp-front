import type { UserRole } from "@/src/entities/user";

export function hasRequiredRole(
  role: UserRole | null | undefined,
  allowedRoles: readonly UserRole[],
) {
  return role != null && allowedRoles.includes(role);
}

export function getRoleLandingPath(role: UserRole | null | undefined) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "DISPATCHER":
      return "/dispatcher";
    default:
      return "/profile";
  }
}
