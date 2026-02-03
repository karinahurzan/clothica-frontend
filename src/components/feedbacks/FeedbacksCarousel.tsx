"use client";

import { useEffect, useState } from "react";
import ContainerLayout from "@/components/layout/ContainerLayout";

import { Loader } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NotFoundFeedbacksCard from "@/components/common/NotFoundFeedbacksCard";
import FeedbackCard from "@/components/feedbacks/FeedbackCard";
import { CreateFeedbackModal } from "@/components/feedbacks/CreateFeedbackModal";
import { Feedback } from "@/domains/feedbacks/type";
import { useLatestFeedbacks } from "@/domains/feedbacks";

interface FeedbacksCarouselProps {
  feedbacks?: Feedback[] | undefined;
  isLoading?: boolean;
  productId?: string | undefined;
  isMainPage?: boolean;
}

export default function FeedbacksCarousel({
  feedbacks,
  isLoading,
  productId,
  isMainPage = false,
}: FeedbacksCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScroll, setCanScroll] = useState(false);

  const { data: latestFeedbacks, isFetching, isError } =
    useLatestFeedbacks(isMainPage);

  useEffect(() => {
    if (!api) return;

    const updateScrollStatus = () => {
      setCanScroll(api.canScrollPrev() || api.canScrollNext());
    };

    updateScrollStatus();
    api.on("select", updateScrollStatus);
    api.on("reInit", updateScrollStatus);
  }, [api]);

  const mainData = isMainPage ? latestFeedbacks : feedbacks;

  return (
    <ContainerLayout className="flex flex-col justify-center items-center">
      <div className="flex flex-row items-end mb-10 md:justify-between w-full">
        <h2 className="text-4xl xl:text-5xl">
          {isMainPage ? "Останні відгуки" : "Відгуки клієнтів"}
        </h2>
        {!isMainPage && <CreateFeedbackModal productId={productId as string} />}
      </div>

      {isLoading || isFetching ? (
        <div className="flex items-center justify-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <>
          {mainData?.length === 0 || isError ? (
            <NotFoundFeedbacksCard />
          ) : (
            <Carousel
              setApi={setApi}
              className="max-w-70 mx-0 my-auto md:max-w-2xl xl:max-w-7xl"
            >
              <CarouselContent>
                {mainData?.map((feedback) => (
                  <CarouselItem
                    key={feedback.id}
                    className="md:basis-1/2 xl:basis-1/3"
                  >
                    <div className="p-1">
                      <FeedbackCard
                        isMainPage={isMainPage}
                        feedback={feedback}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {canScroll && (
                <>
                  <div className="flex justify-end gap-4">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                  </div>
                </>
              )}
            </Carousel>
          )}
        </>
      )}
    </ContainerLayout>
  );
}
