import { Star } from "lucide-react";

type RatingStarsProps = {
  rating: number;
  max?: number;
};

export const RatingStars = ({ rating, max = 5 }: RatingStarsProps) => {
  return (
    <div className="flex items-center gap-1 text-black">
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1);

        return (
          <div key={i} className="relative w-5 h-5">
            <Star size={20} strokeWidth={1} className="absolute inset-0" />

            {fill > 0 && (
              <Star
                size={20}
                strokeWidth={1}
                className="absolute inset-0 fill-current"
                style={{
                  clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
