"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CollectionTable } from "@/components/admin/collection/collection-table";
import {
  useCollections,
  useDeleteCollection,
} from "@/lib/hooks/use-collections";
import type { CollectionFilters } from "@/types/collection";

function CollectionsPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const filters: CollectionFilters = {
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "10"),
    sortBy: (searchParams.get("sortBy") as CollectionFilters["sortBy"]) || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    search: searchParams.get("search") || undefined,
    isActive:
      searchParams.get("isActive") === "true"
        ? true
        : searchParams.get("isActive") === "false"
        ? false
        : undefined,
  };

  const { data, isLoading, error } = useCollections(filters);
  const deleteCollection = useDeleteCollection();

  const handleFiltersChange = (newFilters: CollectionFilters) => {
    const params = new URLSearchParams();

    if (newFilters.page) params.set("page", String(newFilters.page));
    if (newFilters.pageSize) params.set("pageSize", String(newFilters.pageSize));
    if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
    if (newFilters.sortOrder) params.set("sortOrder", newFilters.sortOrder);
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.isActive !== undefined) {
      params.set("isActive", String(newFilters.isActive));
    }

    const queryString = params.toString();
    window.location.href = `/admin/collections${queryString ? `?${queryString}` : ""}`;
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await deleteCollection.mutateAsync(id);
      toast({
        title: "Thành công",
        description: "Đã xóa bộ sưu tập",
      });
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Không thể xóa bộ sưu tập",
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
        <h1 className="text-2xl font-semibold text-slate-900">Bộ sưu tập</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý bộ sưu tập sản phẩm
        </p>
      </div>

      <CollectionTable
        collections={data?.data || []}
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
        onDeleteCollection={handleDeleteCollection}
        isDeleting={deleteCollection.isPending}
      />
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Bộ sưu tập</h1>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý bộ sưu tập sản phẩm
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
      <CollectionsPageContent />
    </Suspense>
  );
}
