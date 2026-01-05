import Link from "next/link";
import { Good } from "@/domains/goods";
import Placeholder from "./Placeholder";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Feedback, getFeedbacks } from "@/domains/feedbacks";
import { MdOutlineComment } from "react-icons/md";

interface Props {
  good: Good;
}

export default function GoodCard({ good }: Props) {
  const hasImage = good.image;

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    (async () => {
      try {
        const data = await getFeedbacks({ productId: good.id });
        setFeedbacks(data);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      }
    })();

    return () => clearTimeout(timer);
  }, [good.id]);

  const ratingSum = feedbacks.reduce(
    (acc, feedback) => (acc += feedback.rate),
    0
  );

  const middleRating = ratingSum / feedbacks.length;

  return (
    <Link href={`/goods?goodId=${good.id}`} className="flex flex-col group">
      <div className="relative mb-4 hover:shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition-all duration-200 overflow-hidden rounded-2xl bg-neutral-darkest-5">
        {hasImage ? (
          <Image
            src={good.image}
            alt={good.name}
            className="object-cover min-w-76 min-h-93.75"
            width={304}
            height={375}
          />
        ) : (
          <Placeholder />
        )}
      </div>

      <div className="text-xl mb-1 font-semibold flex flex-row justify-between items-start min-h-13.5">
        <p>{good.name}</p>
        <span className="whitespace-nowrap">
          {good.price.value} {good.price.currency}
        </span>
      </div>

      <div className="flex flex-row justify-start items-center gap-3">
        {feedbacks.length > 0 && (
          <div className="flex flex-row gap-1">
            <FaStar />
            <span>{middleRating}</span>
          </div>
        )}
        <div className="flex flex-row gap-1">
          <MdOutlineComment />
          <span>{feedbacks.length}</span>
        </div>
      </div>
    </Link>
  );
}
