import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NoOrdersFoundCard() {
  return (
    <div className="bg-deco-light py-6 px-4 md:px-8 xl:px-22 gap-4 rounded-2xl flex flex-col justify-between items-center text-center">
      <p className="font-semibold text-lg">
        У вас ще не було жодних замовлень! Мершій до покупок!
      </p>
      <Link
        href="/goods"
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "rounded-full px-6",
        )}
      >
        До покупок
      </Link>
    </div>
  );
}
