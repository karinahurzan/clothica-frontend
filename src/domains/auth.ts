import { apiClient } from "@/lib/apiClient";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface LoginProps {
  email: string;
  password: string;
  callbackUrl?: string;
}

interface Token {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires?: number;
  error?: string;
}

export async function login({ email, password, callbackUrl }: LoginProps) {
  try {
    await apiClient.post("/auth/login", {
      email,
      password,
    });

    toast.success("Успішний вхід", {
      description: "Виконується вхід...",
    });

    return signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: callbackUrl ?? "/",
    });
  } catch (error) {
    let errorMessage = "Щось пішло не так. Спробуйте ще раз.";

    if (error instanceof AxiosError && error.response) {
      const data = error.response.data;

      if (typeof data.detail === "string") {
        errorMessage =
          data.detail === "Wrong email or password"
            ? "Неправильний пароль або email"
            : data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMessage = data.detail[0]?.msg || "Помилка валідації даних";
      }
    }

    toast.error("Помилка", {
      description: errorMessage,
    });
  }
}

interface SignInProps {
  email: string;
  password: string;
  full_name: string;
}

export async function register({ email, password, full_name }: SignInProps) {
  try {
    await apiClient.post("/auth/register", {
      email,
      password,
      full_name,
    });

    toast.success("Успішна реєстрація", {
      description: "Ваш акаунт створено. Виконується вхід...",
    });

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });
  } catch (error) {
    let errorMessage = "Щось пішло не так. Спробуйте ще раз.";

    if (error instanceof AxiosError && error.response) {
      const data = error.response.data;

      if (typeof data.detail === "string") {
        errorMessage =
          data.detail === "Wrong email or password"
            ? "Неправильний пароль або email"
            : data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMessage = data.detail[0]?.msg || "Помилка валідації даних";
      }
    }

    toast.error("Помилка", {
      description: errorMessage,
    });
  }
}

interface LogOutProps {
  token: string;
}

export async function logout({ token }: LogOutProps) {
  try {
    await apiClient.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    toast.success("Успішний вихід", {
      description: "Ви вийшли зі свого акаунту",
    });
  } catch (error) {
    console.error("Backend logout error:", error);
  } finally {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  }
}

export async function refreshAccessToken(token: Token) {
  try {
    const response = await apiClient.post(
      "/auth/refresh",
      {
        refresh_token: token.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      },
    );

    const refreshedTokens = await response.data;

    return {
      ...token,
      accessToken: refreshedTokens.token,
      accessTokenExpires: Date.now() + 120 * 60 * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
