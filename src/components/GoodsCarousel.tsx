"use client";

import { useState } from "react";
import ContainerLayout from "./ContainerLayout";
import GoodCard from "./GoodCard";
import { Loader } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { CarouselDots } from "./CarouselDots";
import { GoodsResponse } from "@/domains/goods/type";
import { useGoods } from "@/domains/goods";
import NotFoundGoodsCard from "./NotFoundGoodsCard";
import { v4 as uuidv4 } from "uuid";

export default function GoodsCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  const { data, isLoading, isError } = useGoods({});

  const goods = data?.pages?.flatMap((page: GoodsResponse) => page.items) || [];

  return (
    <ContainerLayout className="flex flex-col justify-center items-center">
      <div className="flex flex-row items-end mb-10 md:justify-between w-full">
        <h2 className="text-4xl xl:text-5xl">Популярні товари</h2>
        <Link
          href={"/goods"}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "py-1.5 px-3"
          )}
        >
          Всі товари
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <>
          {goods.length === 0 || isError ? (
            <NotFoundGoodsCard />
          ) : (
            <Carousel
              setApi={setApi}
              className="max-w-70 mx-0 my-auto md:max-w-2xl xl:max-w-7xl"
            >
              <CarouselContent>
                {goods.map((good) => (
                  <CarouselItem
                    key={uuidv4()}
                    className="md:basis-3/9 xl:basis-1/4"
                  >
                    <div className="p-1">
                      <GoodCard good={good} />
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

              <CarouselDots api={api} itemsCount={goods.length} />
            </Carousel>
          )}
        </>
      )}
    </ContainerLayout>
  );
}
