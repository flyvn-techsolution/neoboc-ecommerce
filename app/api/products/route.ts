import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { toImageArray } from "@/lib/utils/format";

interface ProductVariantInput {
  name: string;
  sku?: string | null;
  stock?: number;
  image?: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");
    const categoryId = searchParams.get("categoryId");
    const collectionId = searchParams.get("collectionId");

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== null && isActive !== "") {
      where.isActive = isActive === "true";
    }

    if (categoryId) {
      where.categories = {
        some: {
          categoryId,
        },
      };
    }

    if (collectionId) {
      where.collections = {
        some: {
          collectionId,
        },
      };
    }

    const skip = (page - 1) * pageSize;
    const includeArgs = {
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
      _count: {
        select: {
          orderItems: true,
        },
      },
    } satisfies Prisma.ProductInclude;

    if (sortBy === "stock") {
      const products = await prisma.product.findMany({
        where,
        include: includeArgs,
      });

      const formattedProducts = products
        .map((product) => ({
          ...product,
          price: Number(product.price),
          originalPrice: product.originalPrice
            ? Number(product.originalPrice)
            : null,
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          stock: product.variants.reduce((sum, variant) => sum + variant.stock, 0),
          images: toImageArray(product.images),
          featuredImage: product.featuredImage || null,
          categories: product.categories.map((cp) => cp.category),
          collections: product.collections.map((cp) => cp.collection),
        }))
        .sort((a, b) =>
          sortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock
        );

      const pagedProducts = formattedProducts.slice(skip, skip + pageSize);
      const total = formattedProducts.length;

      return NextResponse.json({
        data: pagedProducts,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === "price") {
      orderBy.price = sortOrder as "asc" | "desc";
    } else if (sortBy === "name") {
      orderBy.name = sortOrder as "asc" | "desc";
    } else {
      orderBy.createdAt = sortOrder as "asc" | "desc";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: includeArgs,
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      stock: product.variants.reduce((sum, variant) => sum + variant.stock, 0),
      images: toImageArray(product.images),
      featuredImage: product.featuredImage || null,
      categories: product.categories.map((cp) => cp.category),
      collections: product.collections.map((cp) => cp.collection),
    }));

    return NextResponse.json({
      data: formattedProducts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      salePrice,
      images,
      seoTitle,
      seoDescription,
      isActive,
      categoryIds,
      collectionIds,
      variants,
      featuredImage,
    } = body;
    const normalizedImages = toImageArray(images);

    if (!name || !slug || price === undefined) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc: name, slug, price" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Slug đã tồn tại, vui lòng chọn slug khác" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: new Prisma.Decimal(price),
        originalPrice: originalPrice ? new Prisma.Decimal(originalPrice) : null,
        salePrice: salePrice ? new Prisma.Decimal(salePrice) : null,
        images: normalizedImages,
        featuredImage: featuredImage || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isActive: isActive !== undefined ? isActive : true,
        categories: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId: string) => ({
                category: {
                  connect: { id: categoryId },
                },
              })),
            }
          : undefined,
        collections: collectionIds?.length
          ? {
              create: collectionIds.map((collectionId: string) => ({
                collection: {
                  connect: { id: collectionId },
                },
              })),
            }
          : undefined,
        variants: variants?.length
          ? {
              create: variants.map((variant: ProductVariantInput) => ({
                name: variant.name,
                sku: variant.sku?.trim() || null,
                stock: Math.max(0, Number(variant.stock) || 0),
                image: variant.image?.trim() || null,
              })),
            }
          : undefined,
      },
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

    const formattedProduct = {
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice
        ? Number(product.originalPrice)
        : null,
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      stock: product.variants.reduce((sum, variant) => sum + variant.stock, 0),
      images: toImageArray(product.images),
      featuredImage: product.featuredImage,
      categories: product.categories.map((cp) => cp.category),
      collections: product.collections.map((cp) => cp.collection),
    };

    return NextResponse.json(formattedProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo sản phẩm" },
      { status: 500 }
    );
  }
}
