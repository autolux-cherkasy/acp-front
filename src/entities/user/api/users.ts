import { ApiError, apiFetch } from "@/src/shared/api/http";
import {
  changeDevPassword,
  getDevProfile,
  updateDevProfile,
} from "@/src/shared/api/dev-auth";

export const USER_ROLES = ["USER", "ADMIN", "DISPATCHER"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type UserProfile = {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  role?: UserRole | null;
  specialCategory: string | null;
  documentPhoto: string | null;
  createdAt: string;
};

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  specialCategory?: string;
  documentPhoto?: string;
};

export type UpdateProfileResponse = {
  message: string;
  user: Omit<UserProfile, "createdAt">;
};

export type ChangePasswordPayload = {
  password: string;
  confirmPassword: string;
};

type MessageResponse = {
  message: string;
};

function toResponseUser(profile: UserProfile): Omit<UserProfile, "createdAt"> {
  const { createdAt: _createdAt, ...user } = profile;
  return user;
}

export async function getProfile() {
  const devProfile = getDevProfile() as UserProfile | null;

  if (devProfile) {
    return devProfile;
  }

  try {
    return await apiFetch<UserProfile | null>("/users/profile");
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }

    throw error;
  }
}

export function updateProfile(payload: UpdateProfilePayload) {
  const devProfile = updateDevProfile(payload) as UserProfile | null;

  if (devProfile) {
    return Promise.resolve<UpdateProfileResponse>({
      message: "Profile updated locally.",
      user: toResponseUser(devProfile),
    });
  }

  return apiFetch<UpdateProfileResponse>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function changePassword(payload: ChangePasswordPayload) {
  const devMessage = changeDevPassword(payload.confirmPassword);

  if (devMessage) {
    return Promise.resolve<MessageResponse>({
      message: devMessage,
    });
  }

  return apiFetch<MessageResponse>("/users/change-password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
