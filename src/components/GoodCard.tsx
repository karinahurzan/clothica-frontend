import Link from "next/link";
import { Good } from "@/domains/goods/type";
import Placeholder from "./Placeholder";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";
import { Feedback, getFeedbacks } from "@/domains/feedbacks";
import { MdOutlineComment } from "react-icons/md";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  good: Good;
}

export default function GoodCard({ good }: Props) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    let isCancelled = false;

    (async () => {
      try {
        const data = await getFeedbacks({ productId: good.id });
        if (!isCancelled) setFeedbacks(data);
      } catch (error) {
        console.error("Помилка завантаження відгуків:", error);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [good.id]);

  const middleRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rate, 0);
    return sum / feedbacks.length;
  }, [feedbacks]);

  return (
    <div className="flex flex-col group min-h-132 max-w-66 md:max-w-50 md:min-h-104 xl:max-w-78 xl:min-h-130">
      <div className="relative mb-4 hover:shadow-lg transition-all duration-200 overflow-hidden rounded-2xl bg-neutral-darkest-5">
        {good.image ? (
          <Image
            src={good.image}
            alt={good.name}
            className="object-cover w-full h-auto min-h-90 md:min-h-61 xl:min-h-94"
            width={304}
            height={375}
            priority={false}
          />
        ) : (
          <Placeholder className="min-h-90 md:min-h-61 xl:min-h-94" />
        )}
      </div>

      <div className="text-xl mb-auto font-semibold flex justify-between items-start gap-2">
        <p className="line-clamp-2">{good.name}</p>
        <span className="whitespace-nowrap hidden xl:block">
          {good.price.value} {good.price.currency}
        </span>
      </div>

      <div className="flex flex-row justify-start items-center gap-3 mt-2">
        {feedbacks.length > 0 ? (
          <div className="flex items-center gap-1">
            <FaStar />
            <span className="text-black">{middleRating.toFixed(1)}</span>
          </div>
        ) : null}
        <div className="flex items-center gap-1 text-gray-500">
          <MdOutlineComment />
          <span>{feedbacks.length}</span>
        </div>
      </div>

      <span className="whitespace-nowrap xl:hidden mb-4 mt-2 text-lg">
        {good.price.value} {good.price.currency}
      </span>

      <Link
        href={`/goods/${good.id}`}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "rounded-full py-2 xl:mt-4 flex items-center justify-center transition-colors"
        )}
      >
        Детальніше
      </Link>
    </div>
  );
}
