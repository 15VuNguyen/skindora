import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

// Helper interface for props
interface HeroProps {
  title?: string;
  subtitle?: string;
}

// 1. Sub-component for the title and subtitle
function HeroTitleAndSubtitle({ title, subtitle }: { title: string; subtitle: string }) {
  const subtitleLines = subtitle.split("\n");

  return (
    <div>
      <h1 className="text-xl font-extrabold tracking-wide text-white uppercase italic">{title}</h1>
      <p className="text-xl font-medium tracking-wider text-gray-200 uppercase">
        {subtitleLines.map((line, index) => (
          <span key={index}>
            {line}
            {index < subtitleLines.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}

// 2. Sub-component for the featured product card
function FeaturedProductCard() {
  return (
    // Main container with glassmorphism styles
    <div className="relative max-w-sm rounded-3xl border border-white/30 bg-white/20 p-6 shadow-lg backdrop-blur-lg">
      {/* Top right arrow button using React Router DOM's Link */}
      <Link to="/products/vichy-mineral-89-booster" className="absolute top-5 right-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
          <ArrowUpRight className="h-6 w-6 text-gray-800" />
        </div>
      </Link>

      {/* Text content */}
      <div className="mb-4">
        <p className="text-sm text-gray-200">Best Seller •</p>
        <h2 className="text-3xl font-bold text-white">
          Vichy Mineral <br /> 89 Booster
        </h2>
      </div>

      {/* Product Image container */}
      <div className="flex justify-center rounded-2xl bg-white p-4">
        <img src="/image 6.png" alt="Vichy Mineral 89 Booster" className="h-48 w-auto object-contain" />
      </div>
    </div>
  );
}

// 3. Main Hero component (default export)
export default function Hero({
  title = "SKIN DORA",
  subtitle = "ELEVATING SKINCARE,\nONE THOUGHTFUL PRODUCT AT A TIME.",
}: HeroProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* The relative parent for all positioned content */}
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background Image */}
          <img src="/image 7.svg" alt="Skincare application" className="h-full w-full object-cover" />

          {/* Text Overlay on the Left */}
          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/30 to-transparent">
            <div className="w-full max-w-xl p-8 md:p-16">
              <HeroTitleAndSubtitle title={title} subtitle={subtitle} />
            </div>
          </div>

          {/* Container to position the product card on the right */}
          <div className="absolute inset-0 flex items-center justify-end p-8 md:p-16">
            <FeaturedProductCard />
          </div>
        </div>
      </div>
    </section>
  );
}
