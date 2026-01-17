import { Feedback } from "@/domains/feedbacks/type";
import { RatingStars } from "./RatingStars";
import Link from "next/link";

interface FeedbackCardProps {
  feedback: Feedback;
  isMainPage?: boolean;
}

export default function FeedbackCard({
  feedback,
  isMainPage = false,
}: FeedbackCardProps) {
  return (
    <div className="min-h-45 flex flex-col justify-between">
      <RatingStars rating={feedback.rate} />
      <p>{feedback.description}</p>

      <div className="flex flex-col gap-1">
        <span className="font-semibold">{feedback.author}</span>

        {isMainPage && (
          <Link
            className="underline font-semibold text-xs"
            href={`/goods/${feedback.product_id}`}
          >
            {feedback.product_name}
          </Link>
        )}
      </div>
    </div>
  );
}
