import { ShoppingCart } from "lucide-react";
import Image from "next/image";

const products = [
  {
    name: "FOREST NOIR",
    price: "$42.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZQN5f1_Pww-8FYxaVrBLK4ewbRH4klWrUv0S9CRF-MXr5EJBa3pJCKltWZaNsbt_pkU_-F2PcHW8tyVQMKAyE38ySWzFtq97p_rctSzmsL8xnqC1O8GU_ReKb9_rLA0tQ-iKXj4JamOkHvpXO68E90bt-pHIEVjmQNpsOADxcFeUOjN9UVUpr-XlxglaZhgsDBsZ1otyOa0LsmMMAHIAzlAmu6rSC2u9hSGhua7Esdu7B7_dAdSH6-LP6_qr845n7dR2U-ztJm0OL",
  },
  {
    name: "CHAMPAGNE MIST",
    price: "$38.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzJ42E5Tv_LK1ypMl5unL41SgLLnIS8Zq3mGlHSycOFLbsa-M4JEtevMMTJOuiYbT9NMmQMbG7knKjbGGo_otvUld1Bjc00J0iEvieOJLcd-F4YguIFgMNwcDQwijIh3H_V5ggk4yjSsawDbBJd96LAu_wA2m5bIrg-R2cndqjxcOOwf10XTiNJtTXS-hA5HqvvTu_z3RCX9bBkHOgvLAumoV2i87bGR5ximnKtI-zecO8uEtKl-wzJOv79BeSCKWAVJJ3mcLn_6NV",
  },
  {
    name: "DESERT CLAY",
    price: "$45.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnWeEkFULC-9y0CEztucEKTcdY_TJpjtTQxz3bbADH3r4g8I-5BluIwzZ9b9It_JCgthg0HDj9US80riGnNBy2lJVT_ULYwfynmPJGR7g0b8_gfiP6keAGWiWpxO14QM6Vg6f60mobzlUU30ZRXK9oAGLKH77Ntgm_709dtOTFGbDNNUo70gw8w3dPeOA2UluQED5NpVa6hpzHKbc2mPdnzszEJhjAdyFxxfRJxqPjh7-JNXnvBIlujJBVg09uTKvMik7EynCD-G-Q",
  },
  {
    name: "COBALT CORE",
    price: "$48.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBs_5BXEtDKbh6pcIjRl0s6GpYi_ZSWmMU9e6BC94a8JFFNa8l57n4ATOgoCl21W4Y_Iyl39Edo3AkmAboOJzXPnrz0zbPJ7IO6sLdBWJaLrq-m4c26VYP9ZsyYbh_geK6QrcRFRZ32fpby4zTSU57gro9bfzz6L5a2zoJmcDToE7HiY_dQ9Ws5A35OzNYPMaB16LEyyh-bvHFc2UwlWpnbqXAn2G9XjjMfirCEopkL-Yxcwj8xGczWgUauwY5rnxUdHBxxMF6z5tXf",
  },
];

export function BestsellersSection() {
  return (
    <section className="border-t-2 border-[#1d1b18] px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center text-4xl font-black italic text-[#1d1b18]">THE BESTSELLERS</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.name} className="group border-2 border-[#1d1b18] bg-[#fef9f3] p-4">
              <div className="relative mb-6 aspect-square overflow-hidden rounded-lg border-2 border-transparent bg-[#f2ede7] transition-all group-hover:border-[#1d1b18]">
                <Image
                  alt={product.name}
                  className="h-full w-full object-cover grayscale-[0.3] transition-all duration-500 group-hover:grayscale-0"
                  src={product.image}
                  fill
                />
              </div>
              <h4 className="text-lg font-bold text-[#1d1b18]">{product.name}</h4>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-black text-[#a43716]">{product.price}</span>
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
