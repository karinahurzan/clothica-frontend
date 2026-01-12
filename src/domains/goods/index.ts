import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { UseGoodsProps } from "./type";
import { getGoodById, getGoods } from "./service";

export function useGoods({
  gender,
  category_id,
  size,
  minPrice,
  maxPrice,
}: UseGoodsProps) {
  return useInfiniteQuery({
    queryKey: ["goods", { gender, category_id, size, minPrice, maxPrice }],
    queryFn: ({ pageParam = 1 }) =>
      getGoods({
        gender,
        category_id,
        page: pageParam,
        perPage: 12,
        size,
        minPrice,
        maxPrice,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.has_more ? allPages.length + 1 : undefined;
    },
  });
}

export function useGood({ id }: { id: string }) {
  return useQuery({
    queryKey: ["goods", id],
    queryFn: () => getGoodById({ id }),
    enabled: !!id,
  });
}
