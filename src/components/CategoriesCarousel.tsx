"use client";

import { useState } from "react";
import ContainerLayout from "./ContainerLayout";
import CategoryCard from "./CategoryCard";
import { Loader } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { useCategories } from "@/domains/categories";
import NotFoundCategoriesCard from "./NotFoundCategoriesCard";
import { v4 as uuidv4 } from "uuid";

export default function CategoriesCarousel() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <ContainerLayout className="flex flex-col justify-center items-center">
      <div className="flex flex-row items-end mb-10 md:justify-between w-full">
        <h2 className="text-4xl xl:text-5xl">Популярні категорії</h2>
        <Link
          href={"/categories"}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "py-1.5 px-3"
          )}
        >
          Всі категорії
        </Link>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <>
          {categories?.length === 0 || isError ? (
            <NotFoundCategoriesCard />
          ) : (
            <Carousel className="max-w-70 mx-0 my-auto md:max-w-2xl xl:max-w-7xl">
              <CarouselContent>
                {categories?.map((cat) => (
                  <CarouselItem
                    key={uuidv4()}
                    className="md:basis-1/2 xl:basis-1/3"
                  >
                    <div className="p-1">
                      <CategoryCard category={cat} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="hidden md:flex md:translate-x-10 xl:translate-x-5" />
              <CarouselNext className="hidden md:flex md:-translate-x-10 xl:-translate-x-5" />

              <div className="flex justify-end gap-4 md:hidden">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          )}
        </>
      )}
    </ContainerLayout>
  );
}
