import Image from "next/image";
import { prisma } from "@/lib/prisma";

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDAWwbZrVfteUmXNR_jPVzdnlrqRCj6Tysu4a7SoHRxhrBXyGhpZ5W_hFGtmFdOPLkOwTWGbwOtf49EOuia09b8qHWxdIj7bJjzSUVEghAPBaB67PmHujeMSuq5OSrmpfMsPkiPT4d6dxdsOWDQBA4zXh4pqVmP_fSlQcEJqBGZ2acxRaz6ZrHyYLEec2MdV-KQEZilV6Uhk9VUETDWnKax4HLwBak5MjJCSMB6-_C_Xw0rrbGBLKTu6t_Cn6W2XZhM4hhseCX9KfvM";

type FeaturedCollectionItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

function shuffleCollections<T>(items: T[]): T[] {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

async function getFeaturedCollections(): Promise<FeaturedCollectionItem[]> {
  const activeCollections = await prisma.collection.findMany({
    where: {
      isActive: true,
      products: {
        some: {},
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      products: {
        take: 1,
        orderBy: {
          product: {
            createdAt: "asc",
          },
        },
        select: {
          product: {
            select: {
              featuredImage: true,
              images: true,
            },
          },
        },
      },
    },
  });

  return shuffleCollections(activeCollections)
    .slice(0, 2)
    .map((collection) => {
      const firstProduct = collection.products[0]?.product;
      const productImages = Array.isArray(firstProduct?.images) ? firstProduct.images : [];
      const firstProductImage = productImages.find(
        (item): item is string => typeof item === "string" && item.trim().length > 0
      );

      return {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        image: firstProduct?.featuredImage || firstProductImage || FALLBACK_IMAGE,
      };
    });
}

export async function FeaturedCollections() {
  const collections = await getFeaturedCollections();
  const currentYear = new Date().getFullYear();

  return (
    <section className="border-y-2 border-[#1d1b18] bg-[#f8f3ed] py-24">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#a43716]">
              Seasonal Drops
            </span>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-[#1d1b18] md:text-5xl">
              FEATURED <br /> COLLECTIONS
            </h2>
          </div>
          <button className="border-2 border-[#1d1b18] px-8 py-3 text-xs font-bold uppercase text-[#1d1b18] transition-all hover:bg-[#1d1b18] hover:text-[#fef9f3]">
            View All {currentYear}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-1 border-2 border-[#1d1b18] bg-[#1d1b18] p-1 md:grid-cols-2">
          {collections.map((collection) => (
            <div key={collection.id} className="group relative h-[600px] overflow-hidden bg-[#fef9f3]">
              <Image
                alt={collection.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={collection.image}
                fill
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-[#1d1b18]/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="border-2 border-[#1d1b18] bg-[#fef9f3] px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#1d1b18] shadow-[4px_4px_0px_0px_rgba(29,27,24,1)]">
                  View Details
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1d1b18]/80 to-transparent p-8 text-[#fef9f3]">
                <h4 className="text-3xl font-black italic tracking-tighter">{collection.name}</h4>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                  Featured Collection
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
