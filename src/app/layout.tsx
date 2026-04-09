import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeoBóc Ecommerce",
  description: "Hệ thống quản lý bán hàng NeoBóc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
