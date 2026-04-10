"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/admin/category/category-form";
import { useCreateCategory } from "@/lib/hooks/use-categories";
import type { CreateCategoryInput } from "@/types/category";

export default function NewCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createCategory = useCreateCategory();

  const handleSubmit = async (data: CreateCategoryInput) => {
    try {
      await createCategory.mutateAsync(data);
      toast({
        title: "Thành công",
        description: "Đã tạo phân loại mới",
        variant: "success",
      });
      router.push("/admin/categories");
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể tạo phân loại",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Thêm phân loại mới
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tạo phân loại mới cho sản phẩm
        </p>
      </div>

      <CategoryForm
        onSubmit={handleSubmit}
        isSubmitting={createCategory.isPending}
      />
    </div>
  );
}
