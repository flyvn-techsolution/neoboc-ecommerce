import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!collection) {
      return NextResponse.json(
        { error: "Không tìm thấy bộ sưu tập" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin bộ sưu tập" },
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
      seoTitle,
      seoDescription,
      isActive,
    } = body;

    const existingCollection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Không tìm thấy bộ sưu tập" },
        { status: 404 }
      );
    }

    if (slug && slug !== existingCollection.slug) {
      const slugExists = await prisma.collection.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug đã tồn tại, vui lòng chọn slug khác" },
          { status: 409 }
        );
      }
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        slug: slug !== undefined ? slug : undefined,
        description:
          description !== undefined
            ? description || null
            : undefined,
        seoTitle: seoTitle !== undefined ? seoTitle || null : undefined,
        seoDescription:
          seoDescription !== undefined ? seoDescription || null : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật bộ sưu tập" },
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

    const existingCollection = await prisma.collection.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Không tìm thấy bộ sưu tập" },
        { status: 404 }
      );
    }

    await prisma.collection.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xóa bộ sưu tập thành công" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa bộ sưu tập" },
      { status: 500 }
    );
  }
}
