import CategoriesCarousel from "@/components/categories/CategoriesCarousel";
import Characteristics from "@/components/layout/Characteristics";
import FeedbacksCarousel from "@/components/feedbacks/FeedbacksCarousel";
import GoodsCarousel from "@/components/commerce/GoodsCarousel";
import Hero from "@/components/layout/Hero";

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
