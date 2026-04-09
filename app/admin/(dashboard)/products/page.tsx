"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ProductTable } from "@/components/admin/product/product-table";
import {
  useProducts,
  useDeleteProduct,
} from "@/lib/hooks/use-products";
import type { ProductFilters } from "@/types/product";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const filters: ProductFilters = {
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "10"),
    sortBy: (searchParams.get("sortBy") as ProductFilters["sortBy"]) || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    search: searchParams.get("search") || undefined,
    isActive:
      searchParams.get("isActive") === "true"
        ? true
        : searchParams.get("isActive") === "false"
        ? false
        : undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    collectionId: searchParams.get("collectionId") || undefined,
  };

  const { data, isLoading, error } = useProducts(filters);
  const deleteProduct = useDeleteProduct();

  const handleFiltersChange = (newFilters: ProductFilters) => {
    const params = new URLSearchParams();

    if (newFilters.page) params.set("page", String(newFilters.page));
    if (newFilters.pageSize) params.set("pageSize", String(newFilters.pageSize));
    if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
    if (newFilters.sortOrder) params.set("sortOrder", newFilters.sortOrder);
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.isActive !== undefined) {
      params.set("isActive", String(newFilters.isActive));
    }
    if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId);
    if (newFilters.collectionId) {
      params.set("collectionId", newFilters.collectionId);
    }

    const queryString = params.toString();
    window.location.href = `/admin/products${queryString ? `?${queryString}` : ""}`;
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({
        title: "Thành công",
        description: "Đã xóa sản phẩm",
      });
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Không thể xóa sản phẩm",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="font-medium">Đã xảy ra lỗi</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Sản phẩm</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý danh sách sản phẩm
        </p>
      </div>

      <ProductTable
        products={data?.data || []}
        pagination={
          data?.pagination || {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0,
          }
        }
        isLoading={isLoading}
        onFiltersChange={handleFiltersChange}
        onDeleteProduct={handleDeleteProduct}
        isDeleting={deleteProduct.isPending}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Sản phẩm</h1>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh sách sản phẩm
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-10 rounded bg-slate-200" />
              <div className="space-y-2">
                <div className="h-12 rounded bg-slate-200" />
                <div className="h-12 rounded bg-slate-200" />
                <div className="h-12 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
