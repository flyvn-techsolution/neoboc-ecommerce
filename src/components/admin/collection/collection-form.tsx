"use client";

import { useForm, type FieldErrors } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn, generateSlug } from "@/lib/utils/format";
import type { Collection, CreateCollectionInput } from "@/types/collection";

interface CollectionFormData {
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
}

interface CollectionFormProps {
  collection?: Collection;
  onSubmit: (data: CreateCollectionInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function CollectionForm({
  collection,
  onSubmit,
  isSubmitting,
}: CollectionFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CollectionFormData>({
    defaultValues: {
      name: collection?.name || "",
      slug: collection?.slug || "",
      description: collection?.description || "",
      seoTitle: collection?.seoTitle || "",
      seoDescription: collection?.seoDescription || "",
      isActive: collection?.isActive ?? true,
    },
  });

  const handleNameChange = (value: string) => {
    setValue("name", value);
    setValue("slug", generateSlug(value));
  };

  const validateForm = (data: CollectionFormData): FieldErrors<CollectionFormData> => {
    const errors: FieldErrors<CollectionFormData> = {};

    if (!data.name || data.name.trim() === "") {
      errors.name = { type: "required", message: "Tên bộ sưu tập là bắt buộc" };
    }

    if (!data.slug || data.slug.trim() === "") {
      errors.slug = { type: "required", message: "Slug là bắt buộc" };
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      errors.slug = { type: "pattern", message: "Slug không hợp lệ (chỉ chứa a-z, 0-9 và dấu -)" };
    }

    return errors;
  };

  const handleFormSubmit = handleSubmit(
    (data) => {
      clearErrors();

      const formErrors = validateForm(data);
      if (Object.keys(formErrors).length > 0) {
        Object.entries(formErrors).forEach(([field, error]) => {
          if (!error) {
            return;
          }

          setError(field as keyof CollectionFormData, {
            type: "manual",
            message: error.message,
          });
        });
        return;
      }

      const submitData: CreateCollectionInput = {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        seoTitle: data.seoTitle || undefined,
        seoDescription: data.seoDescription || undefined,
        isActive: data.isActive,
      };
      onSubmit(submitData);
    },
    (errors) => {
      console.log("Form validation errors:", errors);
    }
  );

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              {watch("isActive") ? "Đang hiển thị" : "Đã ẩn"}
            </Label>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Lưu bộ sưu tập
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">
                  Tên bộ sưu tập <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={cn(
                    errors.name && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="Nhập tên bộ sưu tập"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  className={cn(
                    errors.slug && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="bo-suu-tap-duong-dan"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.slug.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Đường dẫn URL: /collections/{watch("slug") || "slug"}
                </p>
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Nhập mô tả bộ sưu tập"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">Tiêu đề SEO</Label>
                <Input
                  id="seoTitle"
                  {...register("seoTitle")}
                  placeholder="Tiêu đề hiển thị trên Google"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {watch("seoTitle")?.length || 0} / 60 ký tự
                </p>
              </div>
              <div>
                <Label htmlFor="seoDescription">Mô tả SEO</Label>
                <Textarea
                  id="seoDescription"
                  {...register("seoDescription")}
                  placeholder="Mô tả ngắn cho SEO"
                  rows={3}
                />
                <p className="mt-1 text-xs text-slate-500">
                  {watch("seoDescription")?.length || 0} / 160 ký tự
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
