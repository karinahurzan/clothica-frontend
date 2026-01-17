import CategoriesCarousel from "@/components/CategoriesCarousel";
import Characteristics from "@/components/Characteristics";
import FeedbacksCarousel from "@/components/FeedbacksCarousel";
import GoodsCarousel from "@/components/GoodsCarousel";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Characteristics />
      <CategoriesCarousel />
      <GoodsCarousel />
      <FeedbacksCarousel isMainPage={true} />
    </>
  );
}
