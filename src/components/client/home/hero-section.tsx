import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[921px] flex-col items-stretch border-b-2 border-[#1d1b18] md:flex-row">
      <div className="flex flex-1 flex-col justify-center border-[#1d1b18] bg-[#fef9f3] p-8 md:border-r-2 md:p-16">
        <div className="max-w-xl space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a43716]">
            Apothecary of Expression
          </span>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-[-0.04em] text-[#1d1b18] md:text-7xl">
            DESIGN YOUR <br /> UNIQUE <br /> <span className="italic text-[#a43716]">NAILSET</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-[#58423c]">
            Architectural precision meets artisanal craft. Our luxury press-on
            sets are engineered for durability and designed for the avant-garde spirit.
          </p>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <button className="border-2 border-[#1d1b18] bg-[#a43716] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(29,27,24,1)] transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(29,27,24,1)]">
              GET STARTED
            </button>
            <button className="border-2 border-[#1d1b18] bg-[#fef9f3] px-10 py-4 text-sm font-bold uppercase tracking-widest text-[#1d1b18] transition-colors hover:bg-[#e6e2dc]">
              EXPLORE LOOKBOOK
            </button>
          </div>
        </div>
      </div>
      <div className="relative min-h-[500px] flex-1 overflow-hidden bg-[#e6e2dc]">
        <Image
          alt="Luxury Nail Set Hero"
          className="absolute inset-0 h-full w-full object-cover grayscale-[0.2] transition-transform duration-700 hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTiX2TldfQVAtzm4Uo8cbb91MagU4w2iLI7kU-Q0FKuZmxN3I6BT_RRbdeVcvcU1NSEsiNJ65yAyAn94FIoCvAIqboDsXaQinCR44CWhXY0PGq9aVwZQQfSanRV9ciiZq0U4E0DdEeCxgqYWVh9UdJ67DQuz_roHMFzItcmZan_dGugbZjcBbN7P1tJeg4cX5h2oipArhBdJKSPh_prTpoj-pDxhvvxJIeVAq-o1AA5OfKt0MG-d5sQjUmYA09d2fqK7SamT7xDoyL"
          fill
        />
      </div>
    </section>
  );
}
