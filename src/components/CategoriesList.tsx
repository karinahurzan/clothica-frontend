"use client";

import { useMemo, useState } from "react";
import ContainerLayout from "./ContainerLayout";
import CategoryCard from "./CategoryCard";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { uuid } from "@tanstack/react-form";
import { useCategories } from "@/domains/categories";
import NotFoundCategoriesCard from "./NotFoundCategoriesCard";
import { Category } from "@/domains/categories/type";

const LOAD_MORE_AMOUNT = 3;

export default function CategoriesList() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [categories, setCategories] = useState<Category[]>([]);

  const { data, isLoading, isError } = useCategories();

  if (data !== undefined) setCategories(data);

  const visibleCategories = useMemo(
    () => categories.slice(0, visibleCount),
    [categories, visibleCount]
  );

  const isExpanded = visibleCount >= categories.length;
  const canShowButton = categories.length > 4;

  const toggleShow = () => {
    if (isExpanded) {
      setVisibleCount(window.innerWidth >= 1280 ? 6 : 4);
    } else {
      const next = visibleCount + LOAD_MORE_AMOUNT;
      setVisibleCount(Math.min(next, categories.length));
    }
  };

  return (
    <ContainerLayout>
      <h1 className="text-4xl mb-10 xl:text-5xl">Категорії</h1>

      {isError || categories.length === 0 ? (
        <NotFoundCategoriesCard />
      ) : (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {visibleCategories.map((cat) => (
              <li key={uuid()}>
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

          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader className="w-10 h-10 animate-spin" />
            </div>
          )}
        </>
      )}
    </ContainerLayout>
  );
}
