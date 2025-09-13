
export default function PersonalizedBeauty() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="relative h-[400px] overflow-hidden rounded-3xl shadow-lg">
          <img src="/image 26.svg" alt="Personalized beauty analysis" className="h-full w-full object-cover" />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 p-8 text-center">
            <h2 className="font-serif text-5xl font-medium text-white md:text-6xl">( Personalized Beauty )</h2>

            <div className="absolute bottom-12 flex items-center gap-4">
              <div className="h-px w-24 bg-white" />
              <p className="text-2xl text-white italic">powered by AI</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
