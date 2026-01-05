import { cn } from "@/lib/utils";
import ContainerLayout from "./ContainerLayout";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <ContainerLayout className="flex flex-col md:flex-row no-wrap justify-canter items-center gap-8 md:py-16 xl:py-29">
      <div>
        <h1 className="text-[40px] xl:text-[56px] mb-6">
          Знайди свій стиль з Clothica вже сьогодні!
        </h1>
        <p className="text-[18px] mb-8">
          Clothica — це місце, де комфорт поєднується зі стилем. Ми створюємо
          базовий одяг, який легко комбінується та підходить для будь-якої
          нагоди. Обирай речі, що підкреслять твою індивідуальність і завжди
          будуть актуальними.
        </p>
        <ul className="flex flex-col md:flex-row gap-4 w-full">
          <Link
            href={"/goods"}
            className={cn(
              buttonVariants({ variant: "default" }),
              "py-1.5 px-3"
            )}
          >
            До товарів
          </Link>
          <Link
            href={"/categories"}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "py-1.5 px-3"
            )}
          >
            Дослідити категорії
          </Link>
        </ul>
      </div>

      <picture className="w-full md:min-w-84 xl:min-w-160 block h-auto">
        <source
          media="(min-width: 1280px)"
          srcSet="/images/hero/hero-desktop@1x.jpg 1x, /images/hero/hero-desktop@2x.jpg 2x"
        />
        <source
          media="(min-width: 768px)"
          srcSet="/images/hero/hero-tablet@1x.jpg 1x, /images/hero/hero-tablet@2x.jpg 2x"
        />
        <img
          className="rounded-2xl w-full h-auto object-cover"
          src="/images/hero/hero-phone.jpg"
          srcSet="/images/hero/hero-phone@1x.jpg 1x, /images/hero/hero-phone@2x.jpg 2x"
          alt="Молода пара в базовому одязі Clothica"
        />
      </picture>
    </ContainerLayout>
  );
}
