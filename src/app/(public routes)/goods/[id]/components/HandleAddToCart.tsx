import { useState, type ChangeEvent } from "react";
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
import { Good } from "@/domains/goods/type";
import { useBasket } from "@/store/cartStore";
import { toast } from "sonner";

export interface HandleAddToCartProps {
  good?: Good;
}

export default function HandleAddToCart({ good }: HandleAddToCartProps) {
  const [quantity, setQuantity] = useState<number | "">(1);
  const [sizeState, setSizeState] = useState<{
    goodId?: string;
    value?: string;
  }>(() => ({
    goodId: good?.id,
    value: good?.size?.[0],
  }));

  const resolvedSize =
    sizeState.goodId === good?.id ? sizeState.value : good?.size?.[0];

  const handleSizeSelect = (value: string) => {
    setSizeState({ goodId: good?.id, value });
  };

  const addItem = useBasket((state) => state.addGood);

  const handleAddToCart = () => {
    if (good?.size?.length && !resolvedSize) {
      toast.error("Оберіть розмір", {
        description: "Будь ласка, виберіть розмір перед додаванням у кошик",
      });
      return;
    }

    if (good) {
      const finalQuantity = quantity === "" ? 1 : quantity;

      addItem(good, Number(finalQuantity), resolvedSize);
    }

    toast.success("Вітаємо!", {
      description: "Товар додано до кошика",
    });
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
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

      <Select value={resolvedSize} onValueChange={handleSizeSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Виберіть розмір" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {good?.size?.map((size) => (
              <SelectItem key={size} className="capitalize" value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex flex-row gap-4 mt-6 mb-4 max-h-9">
        <Button
          onClick={handleAddToCart}
          variant="default"
          className="w-4/5"
          disabled={!!good?.size?.length && !resolvedSize}
        >
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
