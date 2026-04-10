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
import { cn } from "@/lib/utils/format";
import type { Category, CreateCategoryInput } from "@/types/category";

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
}

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function CategoryForm({
  category,
  onSubmit,
  isSubmitting,
}: CategoryFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      seoTitle: category?.seoTitle || "",
      seoDescription: category?.seoDescription || "",
      isActive: category?.isActive ?? true,
    },
  });

  const handleNameChange = (value: string) => {
    setValue("name", value);
    if (!category) {
      setValue("slug", generateSlug(value));
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const validateForm = (data: CategoryFormData): FieldErrors<CategoryFormData> => {
    const errors: FieldErrors<CategoryFormData> = {};

    if (!data.name || data.name.trim() === "") {
      errors.name = { type: "required", message: "Tên phân loại là bắt buộc" };
    }

    if (!data.slug || data.slug.trim() === "") {
      errors.slug = { type: "required", message: "Slug là bắt buộc" };
    } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
      errors.slug = { type: "pattern", message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang" };
    }

    return errors;
  };

  const handleFormSubmit = handleSubmit(
    (data) => {
      clearErrors();

      const formErrors = validateForm(data);
      if (Object.keys(formErrors).length > 0) {
        Object.entries(formErrors).forEach(([field, error]) => {
          if (!error) return;
          setError(field as keyof CategoryFormData, {
            type: "manual",
            message: error.message,
          });
        });
        return;
      }

      const submitData: CreateCategoryInput = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description.trim() || undefined,
        seoTitle: data.seoTitle.trim() || undefined,
        seoDescription: data.seoDescription.trim() || undefined,
        isActive: data.isActive,
      };

      onSubmit(submitData);
    },
    (errors) => {
      console.log("Form validation errors:", errors);
    }
  );

  const watchedFields = watch();

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin phân loại</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên phân loại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Nailbox Cao Cấp"
                  value={watchedFields.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="VD: nailbox-cao-cap"
                  {...register("slug")}
                  className={cn(errors.slug && "border-red-500")}
                />
                <p className="text-xs text-slate-500">
                  URL thân thiện cho phân loại. Chỉ chấp nhận chữ thường, số và dấu gạch ngang.
                </p>
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả ngắn về phân loại..."
                  rows={4}
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Tiêu đề SEO</Label>
                <Input
                  id="seoTitle"
                  placeholder="Tiêu đề hiển thị trên công cụ tìm kiếm"
                  {...register("seoTitle")}
                />
                <p className="text-xs text-slate-500">
                  Để trống để sử dụng tên phân loại làm tiêu đề SEO.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">Mô tả SEO</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="Mô tả ngắn hiển thị trên công cụ tìm kiếm"
                  rows={3}
                  {...register("seoDescription")}
                />
                <p className="text-xs text-slate-500">
                  Để trống để sử dụng mô tả phân loại làm mô tả SEO.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hiển thị</Label>
                  <p className="text-sm text-slate-500">
                    Phân loại sẽ hiển thị trên cửa hàng
                  </p>
                </div>
                <Switch
                  checked={watchedFields.isActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu phân loại
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
