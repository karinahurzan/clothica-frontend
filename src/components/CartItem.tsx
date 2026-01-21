import { Product } from "@/types";
import Placeholder from "./Placeholder";
import Image from "next/image";

export interface CartItemProps {
  product?: Product;
}

export default function CartItem({ product }: CartItemProps) {
  return (
    <div>
      <div className="relative mb-4 hover:shadow-lg transition-all duration-200 overflow-hidden rounded-2xl bg-neutral-darkest-5">
        {product?.image ? (
          <Image
            src={product?.image}
            alt={product?.name}
            className="object-cover w-full h-auto min-h-90 md:min-h-61 xl:min-h-94"
            width={304}
            height={375}
            priority={false}
          />
        ) : (
          <Placeholder className="min-h-90 md:min-h-61 xl:min-h-94" />
        )}
      </div>
    </div>
  );
}
