"use client";

import { useEffect, useMemo, useState } from "react";
import ContainerLayout from "@/components/layout/ContainerLayout";
import CategoryCard from "@/components/categories/CategoryCard";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useCategories } from "@/domains/categories";
import NotFoundCategoriesCard from "@/components/common/NotFoundCategoriesCard";
import { Category } from "@/domains/categories/type";

const LOAD_MORE_AMOUNT = 4;

const getBaseVisibleCount = () =>
  typeof window !== "undefined" && window.innerWidth >= 1280 ? 6 : 4;

export default function CategoriesList() {
  const [visibleCount, setVisibleCount] = useState(() => getBaseVisibleCount());
  const [categories, setCategories] = useState<Category[]>([]);

  const { data, isLoading, isError } = useCategories();

  useEffect(() => {
    if (data) {
      const id = setTimeout(() => setCategories(data), 0);
      return () => clearTimeout(id);
    }
  }, [data]);

  const visibleCategories = useMemo(
    () => categories.slice(0, visibleCount),
    [categories, visibleCount],
  );

  const isExpanded = visibleCount >= categories.length;
  const canShowButton = categories.length > 4;

  const toggleShow = () => {
    if (isExpanded) {
      setVisibleCount(getBaseVisibleCount());
    } else {
      const next = visibleCount + LOAD_MORE_AMOUNT;
      setVisibleCount(Math.min(next, categories.length));
    }
  };

  return (
    <ContainerLayout>
      <h1 className="text-4xl mb-10 xl:text-5xl">Категорії</h1>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <>
          {isError || categories.length === 0 ? (
            <NotFoundCategoriesCard />
          ) : (
            <>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {visibleCategories.map((cat) => (
                  <li key={cat.id}>
                    <CategoryCard category={cat} />
                  </li>
                ))}
              </ul>

              {canShowButton && categories.length > 0 && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="default"
                    onClick={toggleShow}
                    className="min-w-50"
                  >
                    {isExpanded ? "Показати менше" : "Показати більше"}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </ContainerLayout>
  );
}
