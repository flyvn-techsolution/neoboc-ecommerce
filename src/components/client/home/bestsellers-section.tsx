import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { getRandomProducts } from "@/lib/actions/product-actions";

export async function BestsellersSection() {
  const products = await getRandomProducts(4);

  return (
    <section className="border-t-2 border-[#1d1b18] px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center text-4xl font-black italic text-[#1d1b18]">THE BESTSELLERS</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group border-2 border-[#1d1b18] bg-[#fef9f3] p-4">
              <div className="relative mb-6 aspect-square overflow-hidden rounded-lg border-2 border-transparent bg-[#f2ede7] transition-all group-hover:border-[#1d1b18]">
                <Image
                  alt={product.name}
                  className="h-full w-full object-cover grayscale-[0.3] transition-all duration-500 group-hover:grayscale-0"
                  src={product.featuredImage || product.images[0] || "/placeholder.png"}
                  fill
                />
              </div>
              <h4 className="text-lg font-bold text-[#1d1b18]">{product.name}</h4>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-black text-[#a43716]">${product.price.toFixed(2)}</span>
                <button className="rounded-lg bg-[#1d1b18] p-2 text-[#fef9f3] transition-colors hover:bg-[#a43716]">
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
