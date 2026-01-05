"use client";

import { useEffect, useState } from "react";
import ContainerLayout from "./ContainerLayout";
import { Category, getCategories } from "@/domains/categories";
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

export default function CategoriesCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      }
    })();
  }, []);

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

      <Carousel className="max-w-70 mx-0 my-auto md:max-w-3xl xl:max-w-7xl">
        <CarouselContent>
          {categories.map((cat) => (
            <CarouselItem key={cat.id} className="md:basis-1/2 xl:basis-1/3">
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

      {categories.length === 0 && (
        <div className="flex items-center justify-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      )}
    </ContainerLayout>
  );
}
