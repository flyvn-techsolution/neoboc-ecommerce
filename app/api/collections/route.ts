import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");

    const where: Prisma.CollectionWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== null && isActive !== "") {
      where.isActive = isActive === "true";
    }

    const orderBy: Prisma.CollectionOrderByWithRelationInput = {};
    if (sortBy === "name") {
      orderBy.name = sortOrder as "asc" | "desc";
    } else {
      orderBy.createdAt = sortOrder as "asc" | "desc";
    }

    const skip = (page - 1) * pageSize;

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),
      prisma.collection.count({ where }),
    ]);

    return NextResponse.json({
      data: collections,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách bộ sưu tập" },
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
      seoTitle,
      seoDescription,
      isActive,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc: name, slug" },
        { status: 400 }
      );
    }

    const existingCollection = await prisma.collection.findUnique({
      where: { slug },
    });

    if (existingCollection) {
      return NextResponse.json(
        { error: "Slug đã tồn tại, vui lòng chọn slug khác" },
        { status: 409 }
      );
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description: description || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo bộ sưu tập" },
      { status: 500 }
    );
  }
}
