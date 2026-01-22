import Placeholder from "./Placeholder";
import Image from "next/image";
import { StoreGood, useBasket } from "@/store/cartStore";
import { Star } from "lucide-react";
import { MdOutlineComment } from "react-icons/md";
import { Input } from "./ui/input";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "./ui/button";

export interface CartItemProps {
  product?: StoreGood;
}

export default function CartItem({ product }: CartItemProps) {
  console.log(product);

  const [quantity, setQuantity] = useState<number | undefined | "">(
    product?.quantity,
  );

  const updateGoodQuantity = useBasket((state) => state.updateGoodQuantity);

  const handleUpdateCart = () => {
    if (product?.good) {
      const finalQuantity =
        quantity === "" || Number(quantity) < 1 ? 1 : Number(quantity);

      setQuantity(finalQuantity);
      updateGoodQuantity(product.key, finalQuantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === "") {
      setQuantity("");
      return;
    }

    const parsed = parseInt(val);
    if (!isNaN(parsed)) {
      setQuantity(parsed);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between w-full gap-6">
      <div className="relative mb-4 min-w-20 h-auto min-h-25 md:min-h-25 xl:min-h-25 hover:shadow-lg transition-all duration-200 overflow-hidden rounded-2xl bg-neutral-darkest-5">
        {product?.good.image ? (
          <Image
            src={product?.good.image}
            alt={product?.good.name}
            fill
            className="object-cover"
            priority={false}
            sizes="80px"
          />
        ) : (
          <Placeholder className="min-h-90 md:min-h-61 xl:min-h-94" />
        )}
      </div>

      <div className="flex flex-col xxs:flex-row w-full justify-between gap-2">
        <div>
          <h4 className="text-lg font-semibold">{product?.good.name}</h4>
          <div className="flex flex-row items-center gap-2 text-black">
            <Star size={20} fill="black" strokeWidth={1} />

            <span>{product?.good?.feedbacks_average.toFixed(1)}</span>
            <MdOutlineComment />
            <span>{product?.good?.feedbacks_count || 0}</span>
          </div>
        </div>

        <div className="flex flex-col xxs:flex-row gap-2">
          <span className="whitespace-nowrap xxs:self-center">
            {product?.good.price.value} {product?.good.price.currency}
          </span>

          <div className="flex flex-row gap-2 items-center justify-between xs:justify-start">
            <Input
              type="number"
              min="1"
              className="w-16 h-10"
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleUpdateCart}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateCart();
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />

            <Button className="p-0! gap-0! w-10 h-10" variant="secondary">
              <RiDeleteBin6Line size={19} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
