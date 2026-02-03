import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-opacity-neutral-darkest-60 text-scheme-1-text border-scheme-3-border min-h-16 w-full rounded-xl border bg-opacity-transparent px-2 py-3 text-base transition-[border-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-deco",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
