import CategoriesCarousel from "@/components/CategoriesCarousel";
import Characteristics from "@/components/Characteristics";
import GoodsCarousel from "@/components/GoodsCarousel";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Characteristics />
      <CategoriesCarousel />
      <GoodsCarousel />
    </>
  );
}
