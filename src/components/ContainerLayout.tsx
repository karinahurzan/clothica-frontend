import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { ReactNode, Suspense } from "react";

export default function ContainerLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="px-5 max-h-full md:px-8 xl:px-16">
      <div
        className={cn(
          "max-w-94 mx-0 my-auto py-4 md:max-w-3xl md:py-8 xl:py-12 xl:max-w-7xl",
          className
        )}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <Loader className="w-10 h-10 animate-spin" />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </section>
  );
}
