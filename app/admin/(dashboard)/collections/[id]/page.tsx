"use client";

import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CollectionForm } from "@/components/admin/collection/collection-form";
import {
  useCollection,
  useUpdateCollection,
} from "@/lib/hooks/use-collections";
import type { CreateCollectionInput } from "@/types/collection";

export default function EditCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;
  const { toast } = useToast();
  const updateCollection = useUpdateCollection();

  const { data: collection, isLoading: isLoadingCollection, error: collectionError } = useCollection(collectionId);

  const handleSubmit = async (data: CreateCollectionInput) => {
    try {
      await updateCollection.mutateAsync({ id: collectionId, data });
      toast({
        title: "Thành công",
        description: "Đã cập nhật bộ sưu tập",
        variant: "success",
      });
      router.push("/admin/collections");
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể cập nhật bộ sưu tập",
        variant: "destructive",
      });
    }
  };

  if (collectionError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chỉnh sửa bộ sưu tập
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa thông tin bộ sưu tập
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Đã xảy ra lỗi</p>
          <p className="text-sm">{collectionError.message}</p>
        </div>
      </div>
    );
  }

  if (isLoadingCollection) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chỉnh sửa bộ sưu tập
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa thông tin bộ sưu tập
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

  if (!collection) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Chỉnh sửa bộ sưu tập
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa thông tin bộ sưu tập
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">Không tìm thấy bộ sưu tập</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Chỉnh sửa bộ sưu tập
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Chỉnh sửa thông tin bộ sưu tập: {collection.name}
        </p>
      </div>

      <CollectionForm
        collection={collection}
        onSubmit={handleSubmit}
        isSubmitting={updateCollection.isPending}
      />
    </div>
  );
}
