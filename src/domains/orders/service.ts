import { apiClient, apiGet } from "@/lib/apiClient";
import { handleAxiosError } from "@/lib/handleAxiosError";
import {
  type OrderCreate,
  type OrderOut,
  type PlaceOrderResponse,
} from "./type";

export async function placeOrder(
  order: OrderCreate,
  token?: string,
): Promise<PlaceOrderResponse> {
  try {
    const { data } = await apiClient.post<PlaceOrderResponse>(
      "/orders",
      order,
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined,
    );

    return data;
  } catch (error) {
    handleAxiosError(error, "Не вдалося створити замовлення");
  }
}

export async function getMyOrders(token: string): Promise<OrderOut[]> {
  return apiGet<OrderOut[]>(
    "/orders/my",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    "Не вдалося завантажити ваші замовлення",
  );
}
