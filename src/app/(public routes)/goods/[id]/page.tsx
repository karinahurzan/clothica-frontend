"use client";

import ContainerLayout from "@/components/ContainerLayout";
import Placeholder from "@/components/Placeholder";
import { useGood } from "@/domains/goods";
import Image from "next/image";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCategory } from "@/domains/categories";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { formatReviews } from "@/utils/formatFeedback";
import { RatingStars } from "@/components/RatingStars";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FeedbacksCarousel from "@/components/FeedbacksCarousel";
import { Loader } from "lucide-react";
import { useFeedbacks } from "@/domains/feedbacks";

export default function Good() {
  const params = useParams();
  const id = params.id as string;

  const { data: good, isFetching } = useGood({ id });

  const { data: category } = useCategory(good?.category_id);

  const hasImage = good?.image;

  const { data: feedbacks, isLoading: isFeedbacksLoading } = useFeedbacks(
    good?.id || ""
  );

  const middleRating = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return 0;

    const sum = feedbacks.reduce((acc, f) => acc + f.rate, 0);

    return sum / feedbacks.length;
  }, [feedbacks]);

  return (
    <>
      {isFetching ? (
        <div className="flex items-center justify-center mt-10">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <>
          <ContainerLayout className="md:flex md:flex-row md:justify-between gap-8">
            <div className="max-h-90 md:max-h-90 xl:max-w-160 xl:max-h-175 max-w-full md:w-1/2 mb-4 hover:shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition-all duration-200 overflow-hidden rounded-2xl bg-neutral-darkest-5">
              {hasImage ? (
                <Image
                  src={good.image}
                  alt={good.name}
                  className="object-cover min-h-90 md:min-w-84 md:min-h-90 xl:min-w-160 xl:min-h-175"
                  width={335}
                  height={357}
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <Placeholder className="min-h-90 md:min-w-84 md:min-h-90 xl:min-w-160 xl:min-h-175" />
              )}
            </div>
            <div className="flex-1 w-full md:w-1/2">
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/goods">Всі товари</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`/goods?category_id=${good?.category_id}`}
                    >
                      {category?.name || "Товари"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{good?.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <h1 className="text-3xl mb-6">{good?.name}</h1>

              <div className="flex flex-col xxs:flex-row justify-between xl:justify-start xl:gap-2 xxs:items-center mb-6 min-w-full">
                <div className="flex flex-row gap-1 items-center mb-2 xxs:mb-0">
                  <span className="text-xl">{good?.price.value}</span>
                  <span className="text-xl">{good?.price.currency}</span>
                </div>
                <Separator
                  className="h-7 w-1 hidden xxs:block"
                  orientation="vertical"
                />
                <div className="flex flex-row items-center gap-2">
                  <RatingStars rating={middleRating} />
                  <span>({middleRating.toFixed(1)})</span>
                  <span className="text-lg leading-none">•</span>
                  <span>{formatReviews(feedbacks?.length || 0)}</span>
                </div>
              </div>

              <p className="mb-6">{good?.prevDescription}</p>

              <div className="mb-8">
                <span className="block mb-2">Розмір</span>

                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Виберіть розмір" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {good?.size?.map((size) => (
                        <SelectItem
                          key={uuidv4()}
                          className="capitalize"
                          value={size}
                        >
                          {size}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="flex flex-row gap-4 mt-6 mb-4 max-h-9">
                  <Button variant="default" className="w-4/5">
                    Додати в кошик
                  </Button>

                  <Input type="number" min={1} className="w-1/5" />
                </div>

                <Button variant="secondary" className="w-full">
                  Купити зараз
                </Button>

                <span className="text-xs text-center block mt-4">
                  Безкоштовна доставка для замовлень від 1000 грн
                </span>
              </div>

              <div>
                <span className="border-b border-scheme-1-accent pb-2 mb-6 inline-block">
                  Опис
                </span>

                <p className="mb-4">{good?.description}</p>

                <h3 className="block mb-2">Основні характеристики</h3>

                <ul className="list-disc pl-6 space-y-2 text-neutral-darkest">
                  {good?.characteristics?.map((characteristic) => (
                    <li key={uuidv4()}>{characteristic}</li>
                  ))}
                </ul>
              </div>
            </div>
          </ContainerLayout>

          <ContainerLayout>
            <FeedbacksCarousel
              productId={good?.id}
              feedbacks={feedbacks}
              isLoading={isFeedbacksLoading}
            ></FeedbacksCarousel>
          </ContainerLayout>
        </>
      )}
    </>
  );
}
