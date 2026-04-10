"use client";

import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/admin/category/category-form";
import {
  useCategory,
  useUpdateCategory,
} from "@/lib/hooks/use-categories";
import type { CreateCategoryInput } from "@/types/category";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const { toast } = useToast();
  const updateCategory = useUpdateCategory();

  const { data: category, isLoading: isLoadingCategory, error: categoryError } = useCategory(categoryId);

  const handleSubmit = async (data: CreateCategoryInput) => {
    try {
      await updateCategory.mutateAsync({ id: categoryId, data });
      toast({
        title: "Thành công",
        description: "Đã cập nhật phân loại",
        variant: "success",
      });
      router.push("/admin/categories");
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể cập nhật phân loại",
        variant: "destructive",
      });
    }
  };

  if (categoryError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chỉnh sửa phân loại
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa thông tin phân loại
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Đã xảy ra lỗi</p>
          <p className="text-sm">{categoryError.message}</p>
        </div>
      </div>
    );
  }

  if (isLoadingCategory) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chỉnh sửa phân loại
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa thông tin phân loại
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

  if (!category) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chỉnh sửa phân loại
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa thông tin phân loại
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">Không tìm thấy phân loại</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Chỉnh sửa phân loại
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Chỉnh sửa thông tin phân loại: {category.name}
        </p>
      </div>

      <CategoryForm
        category={category}
        onSubmit={handleSubmit}
        isSubmitting={updateCategory.isPending}
      />
    </div>
  );
}
