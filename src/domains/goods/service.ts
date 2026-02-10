import { apiGet } from "@/lib/apiClient";
import { Good, GoodFilter, GoodsResponse } from "./type";

export async function getGoods({
  gender,
  category_id,
  size,
  minPrice,
  maxPrice,
  page,
  perPage,
}: GoodFilter): Promise<GoodsResponse> {
  return apiGet<GoodsResponse>(
    "/goods",
    {
      params: {
        gender,
        category_id,
        size,
        min_price: minPrice,
        max_price: maxPrice,
        skip: (page - 1) * perPage,
        limit: perPage,
      },
      paramsSerializer: (params) => {
        const search = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (item !== undefined && item !== null) {
                search.append(key, String(item));
              }
            });
            return;
          }

          if (value !== undefined && value !== null) {
            search.append(key, String(value));
          }
        });

        return search.toString();
      },
    },
    "Не вдалося завантажити список товарів",
  );
}

export async function getGoodById(id: string): Promise<Good> {
  return apiGet<Good>(
    `/goods/${id}`,
    undefined,
    "Не вдалося завантажити товар",
  );
}
