"use client";

import { cn } from "@/lib/utils";
import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";

const RangeSlider = ({ className }: { className?: string }) => {
  const [values, setValues] = useState([20, 60]);

  return (
    <div className={cn("w-full max-w-[400px] px-4", className)}>
      <form>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-10"
          defaultValue={[20, 60]}
          value={values}
          onValueChange={setValues}
          max={100}
          step={1}
          min={0}
        >
          <Slider.Track className="bg-neutral-lightest relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-neutral-darkest rounded-full h-full" />
          </Slider.Track>

          <Slider.Thumb
            className="block w-5 h-5 bg-white border-2 border-scheme-1-border shadow-[0_2px_5px_rgba(0,0,0,0.15)] rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black transition-transform"
            aria-label="Minimum value"
          />

          <Slider.Thumb
            className="block w-5 h-5 bg-white border-2 border-scheme-1-border shadow-[0_2px_5px_rgba(0,0,0,0.15)] rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black transition-transform"
            aria-label="Maximum value"
          />
        </Slider.Root>
      </form>

      <div className="flex justify-between mt-1 text-2xl font-normal text-black font-sans">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default RangeSlider;
