import GoodsListClient from "@/components/GoodsListClient";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GoodsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;

  const gender =
    typeof resolvedSearchParams.gender === "string"
      ? resolvedSearchParams.gender
      : undefined;
  const categoryId =
    typeof resolvedSearchParams.category_id === "string"
      ? resolvedSearchParams.category_id
      : undefined;

  const size = Array.isArray(resolvedSearchParams.size)
    ? resolvedSearchParams.size
    : typeof resolvedSearchParams.size === "string"
    ? [resolvedSearchParams.size]
    : undefined;

  const minPrice = resolvedSearchParams.min_price
    ? Number(resolvedSearchParams.min_price)
    : undefined;
  const maxPrice = resolvedSearchParams.max_price
    ? Number(resolvedSearchParams.max_price)
    : undefined;

  return (
    <main>
      <GoodsListClient
        gender={gender}
        category_id={categoryId}
        size={size}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
    </main>
  );
}
