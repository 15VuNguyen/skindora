import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Marquee = () => (
  <div className="relative flex overflow-x-hidden text-blue-400">
    <div className="animate-marquee py-6 whitespace-nowrap">
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
    </div>
    <div className="animate-marquee2 absolute top-0 py-6 whitespace-nowrap">
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
      <span className="mx-4 text-2xl font-bold">NEW IN HOUSE</span>
    </div>
  </div>
);

const LeftProductCard = () => (
  <div className="flex flex-col rounded-3xl bg-[#E6F4FF] p-8">
    <div className="flex-1 md:flex md:gap-6">
      <div className="flex items-center md:w-1/2">
        <p className="text-sm leading-relaxed text-blue-900">
          Clinically proven to provide 10-hour UV protection, this sunscreen shields skin from UV rays, heat, and blue
          light exposure from digital devices. Its lightweight, moisturizing essence formula offers long-lasting defense
          without smudging or discomfort, helping prevent signs of daily skin aging.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center md:mt-0 md:w-1/2">
        <div className="flex h-full max-h-[200px] w-full items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
          <img
            src="/image-Photoroom (8) 1.png"
            alt="ROUND LAB Birch Juice Moisturizing Sunscreen"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
    </div>

    <div className="mt-8 text-left">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">ROUND LAB Birch Juice Moisturizing Sunscreen 50ml</h2>
      <Link to="/products" className="group inline-flex items-center font-semibold text-gray-800">
        SHOP
        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  </div>
);
const RightImageCard = () => (
  <div className="relative h-full overflow-hidden rounded-3xl bg-white">
    <img src="/image 25.svg" alt="Designed for the Future of Your Skin" className="h-full w-full object-cover" />
    <div className="absolute right-8 bottom-8 flex flex-col items-end gap-4">
      <div className="rounded-2xl border border-white/30 bg-white/30 p-4 text-right text-sm text-gray-800 shadow-lg backdrop-blur-md">
        Designed for the Future
        <br />
        of Your Skin
      </div>
      <button
        type="button"
        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/70 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur-md transition-transform hover:scale-105"
      >
        See
        <br />
        more
      </button>
    </div>
  </div>
);

export default function NewInHouse() {
  return (
    <section className="bg-[#EBF5FF] py-12">
      <div className="container mx-auto px-4">
        <Marquee />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <LeftProductCard />
          <RightImageCard />
        </div>
      </div>
    </section>
  );
}
