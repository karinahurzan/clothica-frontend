import api from "@/lib/axios";
import { Good, GoodFilter, GoodResponse, GoodsResponse } from "./type";
import axios from "axios";

export async function getGoods({
  gender,
  category_id,
  size,
  minPrice,
  maxPrice,
  page,
  perPage,
}: GoodFilter): Promise<GoodsResponse> {
  try {
    const { data } = await api.get<GoodsResponse>("/goods", {
      params: {
        gender,
        category_id,
        size,
        min_price: minPrice,
        max_price: maxPrice,
        skip: (page - 1) * perPage,
        limit: perPage,
      },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios помилка:", error.response?.status, error.message);
    } else {
      console.error("Невідома помилка:", error);
    }
    throw new Error("Не вдалося завантажити список товарів");
  }
}

export async function getGoodById({ id }: { id: string }): Promise<Good> {
  try {
    const { data } = await api.get<Good>(`/goods/${id}`);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios помилка:", error.response?.status, error.message);
    } else {
      console.error("Невідома помилка:", error);
    }
    throw new Error("Не вдалося завантажити товар");
  }
}
