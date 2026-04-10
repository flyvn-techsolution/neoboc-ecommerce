import { Search, ShoppingBag } from "lucide-react";

const navItems = ["Collections", "Customizer", "Process", "About"];

export function ClientNavbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b-2 border-[#1d1b18] bg-[#fef9f3]/80 shadow-[4px_4px_0px_0px_rgba(29,27,24,1)] backdrop-blur-md">
      <div className="flex h-20 w-full items-center justify-between px-8">
        <div className="text-2xl font-black tracking-tighter text-[#1d1b18]">NAILBOX</div>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#1d1b18] transition-all duration-200 hover:text-[#a43716]"
              href="#"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[#1d1b18] transition-colors hover:text-[#a43716]">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-[#1d1b18] transition-colors hover:text-[#a43716]">
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
