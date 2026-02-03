"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

function ChipCheckbox({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox-chip"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-sm border px-3 py-1.5 transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",

        "bg-white border-neutral-darkest-15 text-neutral-darkest hover:bg-neutral-lightest",

        "data-[state=checked]:bg-neutral-darkest data-[state=checked]:text-white data-[state=checked]:border-neutral-darkest",

        className
      )}
      {...props}
    >
      {children}
    </CheckboxPrimitive.Root>
  );
}

export { ChipCheckbox };
