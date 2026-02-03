/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { categoryImages } from "@/constants/categoryImages";
import Placeholder from "@/components/common/Placeholder";
import { Category } from "@/domains/categories/type";

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {
  const images = categoryImages[category.name];

  const hasImage = images && images.length > 0;

  return (
    <Link
      href={`/goods?category_id=${category.id}`}
      className="flex flex-col gap-4 group"
    >
      <div className="relative hover:shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition-all duration-200 overflow-hidden rounded-2xl bg-neutral-darkest-5">
        {hasImage ? (
          <img
            srcSet={`${images[0]} 1x, ${images[1] || images[0]} 2x`}
            alt={category.name}
            className="w-full h-full object-cover object-[center_-50px] max-h-69"
            style={{ aspectRatio: "4/3" }}
          />
        ) : (
          <Placeholder />
        )}
      </div>

      <p className="text-xl font-semibold">{category.name}</p>
    </Link>
  );
}
