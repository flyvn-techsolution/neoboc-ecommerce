"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/admin/product/product-form";
import {
  useProduct,
  useUpdateProduct,
} from "@/lib/hooks/use-products";
import type { ProductCategory, ProductCollection } from "@/types/product";
import type { CreateProductInput } from "@/types/product";

async function fetchCategories(): Promise<ProductCategory[]> {
  const res = await fetch("/api/categories?isActive=true");
  if (!res.ok) throw new Error("Không thể tải danh mục");
  const payload = await res.json();
  return Array.isArray(payload) ? payload : [];
}

async function fetchCollections(): Promise<ProductCollection[]> {
  const res = await fetch("/api/collections?isActive=true");
  if (!res.ok) throw new Error("Không thể tải bộ sưu tập");
  const payload = await res.json();
  return Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { toast } = useToast();
  const updateProduct = useUpdateProduct();

  const { data: product, isLoading: isLoadingProduct, error: productError } = useProduct(productId);
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  const handleSubmit = async (data: CreateProductInput) => {
    try {
      await updateProduct.mutateAsync({ id: productId, data });
      toast({
        title: "Thành công",
        description: "Đã cập nhật sản phẩm",
      });
      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể cập nhật sản phẩm",
        variant: "destructive",
      });
    }
  };

  if (productError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chỉnh sửa sản phẩm
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa thông tin sản phẩm
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Đã xảy ra lỗi</p>
          <p className="text-sm">{productError.message}</p>
        </div>
      </div>
    );
  }

  if (isLoadingProduct || isLoadingCategories || isLoadingCollections) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chỉnh sửa sản phẩm
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa thông tin sản phẩm
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-10 rounded bg-slate-200" />
            <div className="h-32 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chỉnh sửa sản phẩm
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa thông tin sản phẩm
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">Không tìm thấy sản phẩm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Chỉnh sửa sản phẩm
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Chỉnh sửa thông tin sản phẩm: {product.name}
        </p>
      </div>

      <ProductForm
        product={product}
        categories={categoriesData || []}
        collections={collectionsData || []}
        onSubmit={handleSubmit}
        isSubmitting={updateProduct.isPending}
      />
    </div>
  );
}
