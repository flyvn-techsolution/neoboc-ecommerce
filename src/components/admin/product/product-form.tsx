"use client";

import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  ImageIcon,
  X,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn, generateSlug } from "@/lib/utils/format";
import type { Product, ProductCategory, ProductCollection, CreateProductInput } from "@/types/product";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  stock: number;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  categoryIds: string[];
  collectionIds: string[];
  images: string[];
}

interface ProductFormProps {
  product?: Product;
  categories: ProductCategory[];
  collections: ProductCollection[];
  onSubmit: (data: CreateProductInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function ProductForm({
  product,
  categories,
  collections,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [variants, setVariants] = useState<
    Array<{
      id?: string;
      variantName: string;
      optionValue: string;
      sku: string | null;
      stock: number;
    }>
  >(product?.variants || []);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price || 0,
      originalPrice: product?.originalPrice ?? undefined,
      salePrice: product?.salePrice ?? undefined,
      stock: product?.stock || 0,
      seoTitle: product?.seoTitle || "",
      seoDescription: product?.seoDescription || "",
      isActive: product?.isActive ?? true,
      categoryIds: product?.categories?.map((c) => c.id) || [],
      collectionIds: product?.collections?.map((c) => c.id) || [],
      images: product?.images || [],
    },
  });

  const handleNameChange = (value: string) => {
    setValue("name", value);
    setValue("slug", generateSlug(value));
  };

  const validateForm = (data: ProductFormData): FieldErrors<ProductFormData> => {
    const errors: FieldErrors<ProductFormData> = {};

    if (!data.name || data.name.trim() === "") {
      errors.name = { type: "required", message: "Tên sản phẩm là bắt buộc" };
    }

    if (!data.slug || data.slug.trim() === "") {
      errors.slug = { type: "required", message: "Slug là bắt buộc" };
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      errors.slug = { type: "pattern", message: "Slug không hợp lệ" };
    }

    if (data.price === undefined || data.price < 0) {
      errors.price = { type: "min", message: "Giá phải lớn hơn hoặc bằng 0" };
    }

    if (data.stock !== undefined && data.stock < 0) {
      errors.stock = { type: "min", message: "Tồn kho phải là số nguyên dương" };
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

          setError(field as keyof ProductFormData, {
            type: "manual",
            message: error.message,
          });
        });
        return;
      }

      const submitData: CreateProductInput = {
        ...data,
        images,
        variants: variants.filter((v) => v.variantName && v.optionValue),
      };
      onSubmit(submitData);
    },
    (errors) => {
      console.log("Form validation errors:", errors);
    }
  );

  const handleAddImage = () => {
    if (newImageUrl && isValidUrl(newImageUrl)) {
      setImages((prev) => [...prev, newImageUrl]);
      setValue("images", [...images, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue("images", newImages);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { variantName: "", optionValue: "", sku: "", stock: 0 },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = watch("categoryIds") || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];
    setValue("categoryIds", newCategories);
  };

  const handleCollectionToggle = (collectionId: string) => {
    const currentCollections = watch("collectionIds") || [];
    const newCollections = currentCollections.includes(collectionId)
      ? currentCollections.filter((id) => id !== collectionId)
      : [...currentCollections, collectionId];
    setValue("collectionIds", newCollections);
  };

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
              {watch("isActive") ? "Đang bán" : "Đã ẩn"}
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
                Lưu sản phẩm
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
                  Tên sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
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
                  placeholder="san-pham-duong-dan"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Nhập mô tả sản phẩm"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Giá cả</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="price">
                    Giá bán <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="1000"
                    min="0"
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="originalPrice">Giá gốc</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="1000"
                    min="0"
                    {...register("originalPrice", { valueAsNumber: true })}
                    placeholder="Giá trước khi giảm"
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Giá khuyến mãi</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="1000"
                    min="0"
                    {...register("salePrice", { valueAsNumber: true })}
                    placeholder="Giá đang giảm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stock">Số lượng tồn kho</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-100 group"
                    >
                      <Image
                        src={url}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-brand-500 text-white text-xs px-1.5 py-0.5 rounded">
                          Ảnh chính
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Nhập URL hình ảnh..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  disabled={!newImageUrl}
                >
                  <Plus className="h-4 w-4" />
                  Thêm
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Biến thể sản phẩm</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVariant}
                >
                  <Plus className="h-4 w-4" />
                  Thêm biến thể
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {variants.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Chưa có biến thể nào. Nhấn &quot;Thêm biến thể&quot; để tạo.
                </p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className="grid gap-4 sm:grid-cols-5 items-end border border-slate-200 rounded-lg p-4"
                    >
                      <div>
                        <Label className="text-xs">Loại biến thể</Label>
                        <Input
                          placeholder="VD: Màu sắc"
                          value={variant.variantName}
                          onChange={(e) =>
                            handleVariantChange(index, "variantName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Giá trị</Label>
                        <Input
                          placeholder="VD: Đỏ"
                          value={variant.optionValue}
                          onChange={(e) =>
                            handleVariantChange(index, "optionValue", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">SKU</Label>
                        <Input
                          placeholder="Mã SKU"
                          value={variant.sku || ""}
                          onChange={(e) =>
                            handleVariantChange(index, "sku", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Tồn kho</Label>
                        <Input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "stock",
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveVariant(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Chưa có danh mục nào
                </p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={watch("categoryIds")?.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collections */}
          <Card>
            <CardHeader>
              <CardTitle>Bộ sưu tập</CardTitle>
            </CardHeader>
            <CardContent>
              {collections.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Chưa có bộ sưu tập nào
                </p>
              ) : (
                <div className="space-y-2">
                  {collections.map((collection) => (
                    <label
                      key={collection.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={watch("collectionIds")?.includes(collection.id)}
                        onChange={() => handleCollectionToggle(collection.id)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm">{collection.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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
              </div>
              <div>
                <Label htmlFor="seoDescription">Mô tả SEO</Label>
                <Textarea
                  id="seoDescription"
                  {...register("seoDescription")}
                  placeholder="Mô tả ngắn cho SEO"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
