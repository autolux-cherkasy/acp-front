import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, LoginPayload } from "./auth";

export function useLoginMutation(setAccessToken: (a: string) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    mutationKey: ["login"],
    onSuccess: async (data) => {
      if (!data?.access_token) {
        throw new Error("Missing access token");
      }

      setAccessToken(data.access_token);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
