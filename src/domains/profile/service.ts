import { apiClient, apiGet } from "@/lib/apiClient";
import { handleAxiosError } from "@/lib/handleAxiosError";
import { toast } from "sonner";
import type { UserProfile, UserProfileUpdatePayload } from "./type";

export async function getCurrentUser(token: string): Promise<UserProfile> {
  return apiGet<UserProfile>(
    "/users/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    "Не вдалося завантажити профіль користувача",
  );
}

export async function updateCurrentUser(
  payload: UserProfileUpdatePayload,
  token: string,
): Promise<UserProfile> {
  try {
    const { data } = await apiClient.patch<UserProfile>("/users/me", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Профіль оновлено", {
      description: "Дані успішно збережено.",
    });

    return data;
  } catch (error) {
    toast.error("Не вдалося оновити профіль", {
      description: "Будь ласка, перевірте дані та спробуйте ще раз.",
    });
    handleAxiosError(error, "Не вдалося оновити профіль користувача");
  }
}
