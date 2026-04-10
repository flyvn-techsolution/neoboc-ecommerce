import { Send } from "lucide-react";

export function ClientFooter() {
  return (
    <footer className="w-full border-t-2 border-[#1d1b18] bg-[#e6e2dc] pb-8 pt-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 md:grid-cols-4">
        <div className="space-y-6">
          <div className="text-xl font-black text-[#1d1b18]">NAILBOX APOTHECARY</div>
          <p className="text-[0.875rem] leading-relaxed text-[#58423c]">
            Crafting architectural beauty for the modern fingertips. Boutique quality, global vision.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#a43716]">Navigation</h4>
          <ul className="space-y-2 text-[0.875rem] text-[#58423c]">
            <li>Collections</li>
            <li>Customizer</li>
            <li>Process</li>
            <li>About</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#a43716]">Support</h4>
          <ul className="space-y-2 text-[0.875rem] text-[#58423c]">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Shipping & Returns</li>
            <li>Wholesale</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#a43716]">Newsletter</h4>
          <p className="text-[0.875rem] text-[#58423c]">Join our limited drop list.</p>
          <div className="flex">
            <input
              className="w-full border-2 border-[#1d1b18] bg-[#fef9f3] px-4 py-2 focus:border-[#a43716] focus:ring-0"
              placeholder="Email Address"
              type="email"
            />
            <button className="border-2 border-l-0 border-[#1d1b18] bg-[#1d1b18] px-4 text-[#fef9f3] transition-colors hover:bg-[#a43716]">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl border-t border-[#1d1b18]/10 px-8 pt-8 text-center">
        <p className="text-[0.7rem] font-black uppercase tracking-widest text-[#58423c]">
          © 2024 NAILBOX APOTHECARY. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
