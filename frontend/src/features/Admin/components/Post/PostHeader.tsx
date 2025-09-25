import blogHero from "@assets/post-hero.jpg";

export function PostHeader() {
  return (
    <header className="relative">
      <div className="relative h-96 overflow-hidden">
        <img src={blogHero} alt="Blog Hero" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <nav className="absolute top-0 right-0 left-0 p-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="text-white">
              <h1 className="text-2xl font-bold">Beauty Blog</h1>
              <p className="text-sm text-white/80">Discover skincare insights</p>
            </div>
          </div>
        </nav>
        <div className="absolute right-0 bottom-0 left-0 p-6">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <h2 className="mb-4 text-4xl font-bold text-white">Discover Your Perfect Skincare Routine</h2>
              <p className="text-lg text-white/90">
                Expert insights, product reviews, and personalized recommendations for every skin type
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
