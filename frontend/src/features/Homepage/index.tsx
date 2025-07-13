import Hero from "@/features/Homepage/components/Hero";

import SkincareAI from "../SkincareAI";
import Footer from "./components/Footer";
import HighlightCatagories from "./components/HighlightCatagories";
import HighlightProducts from "./components/HighlightProducts";

export default function Homepage() {
  return (
    <>
      <Hero />
      <HighlightProducts />
      <HighlightCatagories />
      <SkincareAI />
      <Footer />
    </>
  );
}
