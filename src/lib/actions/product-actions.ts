"use server";

import { prisma } from "@/lib/prisma";
import { toImageArray } from "@/lib/utils/format";
import type { Product } from "@/types/product";

export async function getRandomProducts(limit: number = 4): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      collections: {
        include: {
          collection: true,
        },
      },
      variants: true,
    },
  });

  const shuffled = products.sort(() => Math.random() - 0.5);
  const randomProducts = shuffled.slice(0, limit);

  return randomProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    stock: product.variants.reduce((sum, variant) => sum + variant.stock, 0),
    images: toImageArray(product.images),
    featuredImage: product.featuredImage || null,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    categories: product.categories.map((cp) => cp.category),
    collections: product.collections.map((cp) => cp.collection),
    variants: product.variants,
  }));
}
