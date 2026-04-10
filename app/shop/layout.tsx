import { Manrope } from "next/font/google";
import "./shop.css";

const manrope = Manrope({
  subsets: ["latin"],
});

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${manrope.className} min-h-screen bg-[#fef9f3] text-[#1d1b18]`}>
      {children}
    </div>
  );
}
