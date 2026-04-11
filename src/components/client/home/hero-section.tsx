export function HeroSection() {
  return (
    <section className="relative flex min-h-[921px] flex-col items-stretch border-b-2 border-[#1d1b18]">
      <div className="flex flex-1 flex-col justify-center bg-[#fef9f3] p-8 pb-[22rem] md:p-16 md:pb-16 md:pr-[52%]">
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
      <div className="pointer-events-none absolute right-3 top-[62%] z-10 w-56 -translate-y-1/2 sm:right-6 sm:top-1/2 sm:w-64 md:right-8 md:w-[48%] lg:right-12 lg:w-[46%]">
        <div className="relative border-2 border-[#1d1b18] bg-[#efe4d2] p-2 shadow-[8px_8px_0px_0px_rgba(29,27,24,1)]">
          <div className="border border-[#6b584e] bg-[#d4c0a7] p-1">
            <div className="overflow-hidden border border-[#1d1b18] bg-black">
              <video
                src="/videos/hero_video.mp4"
                className="h-auto w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>
          </div>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#fef9f3] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b584e]">
            Archive Reel
          </span>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_50%)]" />
        </div>
      </div>
    </section>
  );
}
