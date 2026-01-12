"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import FiltersPanel from "./FiltersPanel";
import { usePathname, useRouter } from "next/navigation";

interface MobileFiltersProps {
  maxAvailablePrice: number;
}

export function MobileFilters({ maxAvailablePrice }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const clearAll = () => router.push(pathname);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Фільтри</h2>
        <Button onClick={clearAll} variant="link">
          Очистити всі
        </Button>
      </div>

      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full bg-transparent rounded-2xl overflow-hidden border border-neutral-darkest-15"
      >
        <CollapsibleTrigger className="w-full" asChild>
          <div className="flex w-full items-center justify-between p-2 cursor-pointer">
            <span className="text-lg">Фільтри</span>
            {isOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="w-full pl-2 py-2">
          <ScrollArea className="h-75 pr-4 custom-scrollbar">
            <FiltersPanel maxAvailablePrice={maxAvailablePrice} />
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
