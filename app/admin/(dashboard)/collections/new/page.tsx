"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CollectionForm } from "@/components/admin/collection/collection-form";
import { useCreateCollection } from "@/lib/hooks/use-collections";
import type { CreateCollectionInput } from "@/types/collection";

export default function NewCollectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createCollection = useCreateCollection();

  const handleSubmit = async (data: CreateCollectionInput) => {
    try {
      await createCollection.mutateAsync(data);
      toast({
        title: "Thành công",
        description: "Đã tạo bộ sưu tập mới",
        variant: "success",
      });
      router.push("/admin/collections");
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể tạo bộ sưu tập",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Thêm bộ sưu tập mới
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tạo bộ sưu tập mới trong cửa hàng
        </p>
      </div>

      <CollectionForm
        onSubmit={handleSubmit}
        isSubmitting={createCollection.isPending}
      />
    </div>
  );
}
