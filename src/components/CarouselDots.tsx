"use client";

import { useEffect, useState, useCallback } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface CarouselDotsProps {
  api: CarouselApi | undefined;
  itemsCount: number;
}

export function CarouselDots({ api, itemsCount }: CarouselDotsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    api.reInit();

    const handleReInit = () => {
      setScrollSnaps(api.scrollSnapList());
      setSelectedIndex(api.selectedScrollSnap());
    };

    handleReInit();

    api.on("select", onSelect);
    api.on("reInit", handleReInit);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", handleReInit);
    };
  }, [api, onSelect, itemsCount]);

  if (!api || scrollSnaps.length <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          className={cn(
            "h-2.5 rounded-full transition-all duration-300",
            index === selectedIndex
              ? "bg-neutral-darkest-60 w-5"
              : "bg-neutral-darkest-5 w-2.5 hover:bg-neutral-darkest-15"
          )}
          onClick={() => api.scrollTo(index)}
          type="button"
          aria-label={`Перейти до слайда ${index + 1}`}
        />
      ))}
    </div>
  );
}
