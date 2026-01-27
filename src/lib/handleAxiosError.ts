import axios from "axios";

export function handleAxiosError(
  error: unknown,
  fallbackMessage = "Сталася помилка",
): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || fallbackMessage;

    console.error("API error:", {
      status,
      message,
      data: error.response?.data,
    });

    throw new Error(message);
  }

  console.error("Unknown error:", error);
  throw new Error(fallbackMessage);
}
