import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, updateCurrentUser } from "./service";
import type { UserProfileUpdatePayload } from "./type";

export const useCurrentUser = (token?: string) => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => getCurrentUser(token as string),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateCurrentUser = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserProfileUpdatePayload) => {
      if (!token) {
        return Promise.reject(new Error("Не знайдено токен авторизації"));
      }

      return updateCurrentUser(payload, token);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["users", "me"], data);
    },
  });
};
