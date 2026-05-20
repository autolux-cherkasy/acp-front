import { hasAccessToken } from "@/src/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  ChangePasswordPayload,
  getProfile,
  updateProfile,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "./users";

export const PROFILE_KEY = "profile";

export function useProfileQuery() {
  return useQuery({
    queryFn: getProfile,
    queryKey: [PROFILE_KEY],
    enabled: hasAccessToken(),
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: UpdateProfilePayload,
    ): Promise<UpdateProfileResponse> => {
      return updateProfile(payload);
    },
    mutationKey: ["update-profile"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (
      payload: ChangePasswordPayload,
    ): Promise<{ message: string }> => {
      return changePassword(payload);
    },
    mutationKey: ["change-password"],
  });
}
