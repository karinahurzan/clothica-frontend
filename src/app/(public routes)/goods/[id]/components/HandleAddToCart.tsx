import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { Good } from "@/domains/goods/type";
import { useBasket } from "@/store/cartStore";

export interface HandleAddToCartProps {
  good?: Good;
}

export default function HandleAddToCart({ good }: HandleAddToCartProps) {
  const [quantity, setQuantity] = useState<number | "">(1);

  const addItem = useBasket((state) => state.addGood);

  const handleAddToCart = () => {
    if (good) {
      const finalQuantity = quantity === "" ? 1 : quantity;

      addItem(good, Number(finalQuantity));
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
      setQuantity(Math.max(1, parsed));
    }
  };

  return (
    <div className="mb-8">
      <span className="block mb-2">Розмір</span>

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Виберіть розмір" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {good?.size?.map((size) => (
              <SelectItem key={uuidv4()} className="capitalize" value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex flex-row gap-4 mt-6 mb-4 max-h-9">
        <Button onClick={handleAddToCart} variant="default" className="w-4/5">
          Додати в кошик
        </Button>

        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-1/5"
        />
      </div>

      <Button variant="secondary" className="w-full">
        Купити зараз
      </Button>

      <span className="text-xs text-center block mt-4">
        Безкоштовна доставка для замовлень від 1000 грн
      </span>
    </div>
  );
}
