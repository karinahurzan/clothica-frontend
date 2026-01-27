import api from "@/lib/axios";
import { Good, GoodFilter, GoodsResponse } from "./type";
import { handleAxiosError } from "@/lib/handleAxiosError";

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
    handleAxiosError(error, "Не вдалося завантажити список товарів");
  }
}

export async function getGoodById(id: string): Promise<Good> {
  try {
    const { data } = await api.get<Good>(`/goods/${id}`);
    return data;
  } catch (error) {
    handleAxiosError(error, "Не вдалося завантажити товар");
  }
}
