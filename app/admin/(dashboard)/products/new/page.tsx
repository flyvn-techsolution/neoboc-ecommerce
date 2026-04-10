"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/admin/product/product-form";
import { useCreateProduct } from "@/lib/hooks/use-products";
import { fetchAllCategories } from "@/lib/api/category-api";
import { fetchAllCollections } from "@/lib/api/collection-api";
import type { ProductCategory, ProductCollection } from "@/types/product";
import type { CreateProductInput } from "@/types/product";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createProduct = useCreateProduct();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allCategories, allCollections] = await Promise.all([
          fetchAllCategories(),
          fetchAllCollections(),
        ]);
        setCategories(allCategories);
        setCollections(allCollections);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu danh mục và bộ sưu tập",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
  }, [toast]);

  const handleSubmit = async (data: CreateProductInput) => {
    try {
      await createProduct.mutateAsync(data);
      toast({
        title: "Thành công",
        description: "Đã tạo sản phẩm mới",
        variant: "success",
      });
      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể tạo sản phẩm",
        variant: "destructive",
      });
    }
  };

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Thêm sản phẩm mới
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tạo sản phẩm mới trong cửa hàng
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Thêm sản phẩm mới
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tạo sản phẩm mới trong cửa hàng
        </p>
      </div>

      <ProductForm
        categories={categories}
        collections={collections}
        onSubmit={handleSubmit}
        isSubmitting={createProduct.isPending}
      />
    </div>
  );
}
