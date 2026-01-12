"use client";

import ContainerLayout from "@/components/ContainerLayout";
import Placeholder from "@/components/Placeholder";
import { useGood } from "@/domains/goods";
import Image from "next/image";
import { useParams } from "next/navigation";

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
import { useEffect, useMemo, useState } from "react";
import { Feedback, getFeedbacks } from "@/domains/feedbacks";
import { formatReviews } from "@/utils/formatFeedback";
import { RatingStars } from "@/components/RatingStars";

export default function Good() {
  const params = useParams();
  const id = params.id as string;

  const { data: good } = useGood({ id });

  const { data: category } = useCategory(good?.category_id);

  const hasImage = good?.image;

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    let isCancelled = false;

    (async () => {
      try {
        const data = await getFeedbacks({ productId: id });
        if (!isCancelled) setFeedbacks(data);
      } catch (error) {
        console.error("Помилка завантаження відгуків:", error);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [good?.id]);

  const middleRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rate, 0);
    return sum / feedbacks.length;
  }, [feedbacks]);

  console.log(good);

  return (
    <ContainerLayout>
      <div className="max-w-full mb-4 hover:shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition-all duration-200 overflow-hidden rounded-2xl bg-neutral-darkest-5">
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
      <div className="flex-1 w-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/goods">Всі товари</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/goods?category_id=${good?.category_id}`}>
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

        <div className="flex flex-col xxs:flex-row justify-between xxs:items-center mb-6 min-w-full">
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
            <span>({middleRating})</span>
            <span className="text-lg leading-none">•</span>
            <span>{formatReviews(feedbacks.length)}</span>
          </div>
        </div>

        <p>{good?.description}</p>
      </div>
    </ContainerLayout>
  );
}
