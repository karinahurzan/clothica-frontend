"use client";

import GoodCard from "./GoodCard";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import ContainerLayout from "./ContainerLayout";
import FiltersPanel from "./FiltersPanel";
import { MobileFilters } from "./MobileFilters";
import { usePathname, useRouter } from "next/navigation";
import { Good, GoodsResponse } from "@/domains/goods/type";
import NotFoundGoodsCard from "./NotFoundGoodsCard";
import { useGoods } from "@/domains/goods";
import { useCategories } from "@/domains/categories";

interface Props {
  gender?: string;
  category_id?: string;
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export default function GoodsListClient({
  gender,
  category_id,
  size,
  minPrice,
  maxPrice,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGoods({ gender, category_id, size, minPrice, maxPrice });

  console.log(data);

  const allGoods =
    data?.pages?.flatMap((page: GoodsResponse) => page.items) || [];

  const totalCount =
    data?.pages
      ?.flatMap((page: GoodsResponse) => page.total_count)
      .reduce((sum: number, count: number) => sum + count, 0) || 0;

  const maxAvailablePrice = data?.pages[0]?.max_available_price || 1000;

  const clearAll = () => router.push(pathname);

  const { data: categories } = useCategories();

  const title = category_id
    ? categories?.find((category) => category.id === category_id)?.name
    : "Всі товари";

  return (
    <ContainerLayout>
      <h1 className="text-4xl mb-6 md:mb-10 xl:text-5xl">{title}</h1>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="md:hidden">
            <MobileFilters maxAvailablePrice={maxAvailablePrice} />
          </div>
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">Фільтри</h2>
              <Button onClick={clearAll} variant="link">
                Очистити всі
              </Button>
            </div>
            <FiltersPanel maxAvailablePrice={maxAvailablePrice} />
          </div>

          {totalCount === 0 ? (
            <div className="flex justify-center xl:px-28">
              <NotFoundGoodsCard isLoading={isLoading} onClick={clearAll} />
            </div>
          ) : (
            <div className="flex-1">
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {allGoods.map((good: Good) => (
                  <li key={good.id}>
                    <GoodCard good={good} />
                  </li>
                ))}
              </ul>
              <div className="flex justify-center mt-10">
                {hasNextPage && (
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="min-w-50"
                  >
                    {isFetchingNextPage ? (
                      <Loader className="animate-spin mr-2" />
                    ) : (
                      "Показати більше"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </ContainerLayout>
  );
}
