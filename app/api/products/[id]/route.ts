import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { toImageArray } from "@/lib/utils/format";

interface ProductVariantInput {
  id?: string;
  name: string;
  sku?: string | null;
  stock?: number;
  image?: string | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
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
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin sản phẩm" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const normalizedImages = images !== undefined ? toImageArray(images) : undefined;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug đã tồn tại, vui lòng chọn slug khác" },
          { status: 409 }
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          description: description || null,
          price: price !== undefined ? new Prisma.Decimal(price) : undefined,
          originalPrice:
            originalPrice !== undefined
              ? originalPrice
                ? new Prisma.Decimal(originalPrice)
                : null
              : undefined,
          salePrice:
            salePrice !== undefined
              ? salePrice
                ? new Prisma.Decimal(salePrice)
                : null
              : undefined,
          images: normalizedImages,
          featuredImage: featuredImage !== undefined ? (featuredImage || null) : undefined,
          seoTitle: seoTitle !== undefined ? seoTitle || null : undefined,
          seoDescription:
            seoDescription !== undefined ? seoDescription || null : undefined,
          isActive: isActive !== undefined ? isActive : undefined,
        },
      });

      if (categoryIds !== undefined) {
        await tx.categoryProduct.deleteMany({
          where: { productId: id },
        });

        if (categoryIds?.length) {
          await tx.categoryProduct.createMany({
            data: categoryIds.map((categoryId: string) => ({
              productId: id,
              categoryId,
            })),
          });
        }
      }

      if (collectionIds !== undefined) {
        await tx.collectionProduct.deleteMany({
          where: { productId: id },
        });

        if (collectionIds?.length) {
          await tx.collectionProduct.createMany({
            data: collectionIds.map((collectionId: string) => ({
              productId: id,
              collectionId,
            })),
          });
        }
      }

      if (variants !== undefined) {
        await tx.productVariant.deleteMany({
          where: { productId: id },
        });

        if (variants?.length) {
          await tx.productVariant.createMany({
            data: variants.map((variant: ProductVariantInput) => ({
              productId: id,
              name: variant.name,
              sku: variant.sku?.trim() || null,
              stock: Math.max(0, Number(variant.stock) || 0),
              image: variant.image?.trim() || null,
            })),
          });
        }
      }
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
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
      ...updatedProduct,
      price: Number(updatedProduct!.price),
      originalPrice: updatedProduct!.originalPrice
        ? Number(updatedProduct!.originalPrice)
        : null,
      salePrice: updatedProduct!.salePrice
        ? Number(updatedProduct!.salePrice)
        : null,
      stock: updatedProduct!.variants.reduce((sum, variant) => sum + variant.stock, 0),
      images: toImageArray(updatedProduct!.images),
      featuredImage: updatedProduct!.featuredImage,
      categories: updatedProduct!.categories.map((cp) => cp.category),
      collections: updatedProduct!.collections.map((cp) => cp.collection),
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật sản phẩm" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    if (existingProduct._count.orderItems > 0) {
      return NextResponse.json(
        {
          error:
            "Không thể xóa sản phẩm đã có đơn hàng. Hãy vô hiệu hóa sản phẩm thay vì xóa.",
        },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa sản phẩm" },
      { status: 500 }
    );
  }
}
