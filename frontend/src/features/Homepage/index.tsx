import Hero from "@/features/Homepage/components/Hero";

import SkincareAI from "../SkincareAI";
import Footer from "./components/Footer";
import HighlightProducts from "./components/HighlightProducts";
import NewInHouse from "./components/NewInHouse";
import PersonalizedBeauty from "./components/PersonalizedBeauty";

export default function Homepage() {
  return (
    <>
      <Hero />
      <HighlightProducts />

      <NewInHouse />
      <PersonalizedBeauty />
      <SkincareAI />
      <Footer />
    </>
  );
}
