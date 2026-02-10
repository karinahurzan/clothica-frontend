"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/domains/categories/type";
import { useCategories } from "@/domains/categories";

const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

interface FiltersPanelProps {
  maxAvailablePrice: number;
}

export default function FiltersPanel({ maxAvailablePrice }: FiltersPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: categories } = useCategories();

  const computedSliderRange = useMemo<[number, number]>(() => {
    const rawMin = searchParams.get("min_price");
    const rawMax = searchParams.get("max_price");

    const parsedMin = rawMin !== null ? Number(rawMin) : NaN;
    const parsedMax = rawMax !== null ? Number(rawMax) : NaN;

    const hasValidMin = Number.isFinite(parsedMin);
    const hasValidMax = Number.isFinite(parsedMax);

    const min = hasValidMin
      ? Math.min(Math.max(parsedMin, 0), maxAvailablePrice)
      : 0;
    const maxCandidate = hasValidMax ? parsedMax : maxAvailablePrice;
    const max = Math.min(Math.max(maxCandidate, min), maxAvailablePrice);

    return [min, max];
  }, [searchParams, maxAvailablePrice]);

  const [sliderValue, setSliderValue] =
    useState<[number, number]>(computedSliderRange);

  useEffect(() => {
    setSliderValue((prev) => {
      if (
        prev[0] === computedSliderRange[0] &&
        prev[1] === computedSliderRange[1]
      ) {
        return prev;
      }
      return computedSliderRange;
    });
  }, [computedSliderRange]);

  const updateQuery = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handleSizeChange = (checked: boolean, sizeValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSizes = params.getAll("size");

    if (checked) {
      params.append("size", sizeValue);
    } else {
      const newSizes = currentSizes.filter((s) => s !== sizeValue);
      params.delete("size");
      newSizes.forEach((s) => params.append("size", s));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePriceChange = (values: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const min = Math.max(0, Math.min(Math.round(values[0]), maxAvailablePrice));
    const max = Math.max(
      min,
      Math.min(Math.round(values[1]), maxAvailablePrice),
    );

    const currentMin = Number(params.get("min_price"));
    const currentMax = Number(params.get("max_price"));

    if (currentMin === min && currentMax === max) {
      return;
    }

    params.set("min_price", min.toString());
    params.set("max_price", max.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="w-full md:max-w-50 xl:max-w-70 space-y-8 pr-4">
      <div className="space-y-3">
        <button
          type="button"
          className="cursor-pointer hover:text-neutral-darkest-20 transition"
          onClick={() => updateQuery("category_id", "")}
        >
          Усі
        </button>
        <ul className="space-y-3">
          {categories?.map((cat: Category) => (
            <li
              key={cat.id}
              className="cursor-pointer hover:text-neutral-darkest-20 transition"
              onClick={() => updateQuery("category_id", cat.id)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Розмір</p>
          <Button onClick={() => updateQuery("size", null)} variant="link">
            Очистити
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {SIZES.map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Checkbox
                id={size}
                checked={searchParams.getAll("size").includes(size)}
                onCheckedChange={(checked) => handleSizeChange(!!checked, size)}
              />
              <Label
                htmlFor={size}
                className="text-sm font-normal cursor-pointer"
              >
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Ціна</p>
          <Button
            onClick={() => {
              updateQuery("min_price", null);
              updateQuery("max_price", null);
            }}
            variant="link"
          >
            Очистити
          </Button>
        </div>
        <Slider
          value={sliderValue}
          min={0}
          max={maxAvailablePrice}
          step={10}
          onValueChange={setSliderValue}
          onValueCommit={handlePriceChange}
          className="mt-6"
        />
        <div className="flex justify-between text-sm">
          <span>0</span>
          <span>{maxAvailablePrice}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Стать</p>
          <Button variant="link">Очистити</Button>
        </div>
        <RadioGroup
          defaultValue={searchParams.get("gender") || "all"}
          onValueChange={(val) =>
            updateQuery("gender", val === "all" ? null : val)
          }
          className="gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="font-normal cursor-pointer">
              Всі
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="women" id="women" />
            <Label htmlFor="women" className="font-normal cursor-pointer">
              Жіночий
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="man" id="men" />
            <Label htmlFor="men" className="font-normal cursor-pointer">
              Чоловічий
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="unisex" id="unisex" />
            <Label htmlFor="unisex" className="font-normal cursor-pointer">
              Унісекс
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />
    </aside>
  );
}
