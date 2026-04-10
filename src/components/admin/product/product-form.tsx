"use client";

import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  Save,
  ArrowLeft,
  Loader2,
  Plus,
  ImageIcon,
} from "lucide-react";
import {
  cn,
  generateSlug,
  normalizeImageSrc,
  toImageArray,
} from "@/lib/utils/format";
import { Dropzone } from "@/components/ui/dropzone";
import type { Product, ProductCategory, ProductCollection, CreateProductInput } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  categoryIds: string[];
  collectionIds: string[];
  images: string[];
}

interface ProductVariantFormState {
  id?: string;
  name: string;
  sku: string;
  stock: number;
  image: string | null;
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
  const [images, setImages] = useState<string[]>(toImageArray(product?.images));
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    product?.featuredImage || (product?.images?.length ? toImageArray(product.images)[0] : null)
  );
  const [variantImagePickerIndex, setVariantImagePickerIndex] = useState<number | null>(null);
  const [variants, setVariants] = useState<ProductVariantFormState[]>(
    (product?.variants || []).map((variant) => ({
      id: variant.id,
      name: variant.name,
      sku: variant.sku || "",
      stock: variant.stock,
      image: variant.image || null,
    }))
  );
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
      seoTitle: product?.seoTitle || "",
      seoDescription: product?.seoDescription || "",
      isActive: product?.isActive ?? true,
      categoryIds: product?.categories?.map((c) => c.id) || [],
      collectionIds: product?.collections?.map((c) => c.id) || [],
      images: toImageArray(product?.images),
    },
  });

  const handleNameChange = (value: string) => {
    setValue("name", value);
    setValue("slug", generateSlug(value));
  };

  const validateForm = (data: ProductFormData): FieldErrors<ProductFormData> => {
    const errs: FieldErrors<ProductFormData> = {};

    if (!data.name || data.name.trim() === "") {
      errs.name = { type: "required", message: "Tên sản phẩm là bắt buộc" };
    }

    if (!data.slug || data.slug.trim() === "") {
      errs.slug = { type: "required", message: "Slug là bắt buộc" };
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      errs.slug = { type: "pattern", message: "Slug không hợp lệ" };
    }

    if (data.price === undefined || data.price < 0) {
      errs.price = { type: "min", message: "Giá phải lớn hơn hoặc bằng 0" };
    }

    return errs;
  };

  const onFormSubmit = handleSubmit(
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
        featuredImage: featuredImage || undefined,
        variants: variants
          .filter((variant) => variant.name.trim())
          .map((variant) => ({
            name: variant.name.trim(),
            sku: variant.sku.trim() || null,
            stock: Math.max(0, Number(variant.stock) || 0),
            image: variant.image,
          })),
      };
      onSubmit(submitData);
    },
    (formErrors) => {
      console.log("Form validation errors:", formErrors);
    }
  );

  const handleImagesChange = (newUrls: string[]) => {
    setImages(newUrls);
    setValue("images", newUrls);
    setVariants((prev) =>
      prev.map((variant) =>
        variant.image && !newUrls.includes(variant.image)
          ? { ...variant, image: null }
          : variant
      )
    );
  };

  const handleFeaturedChange = (url: string | null) => {
    setFeaturedImage(url);
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: "", sku: "", stock: 0, image: null },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
    setVariantImagePickerIndex((prev) => {
      if (prev === null) return null;
      if (prev === index) return null;
      return prev > index ? prev - 1 : prev;
    });
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariantFormState,
    value: string | number | null
  ) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    );
  };

  const totalVariantStock = variants.reduce(
    (sum, variant) => sum + Math.max(0, Number(variant.stock) || 0),
    0
  );
  const selectedVariant =
    variantImagePickerIndex !== null ? variants[variantImagePickerIndex] : null;

  const handleOpenVariantImagePicker = (index: number) => {
    setVariantImagePickerIndex(index);
  };

  const handleCloseVariantImagePicker = () => {
    setVariantImagePickerIndex(null);
  };

  const handleSelectVariantImage = (imageUrl: string) => {
    if (variantImagePickerIndex === null) return;
    handleVariantChange(variantImagePickerIndex, "image", imageUrl);
    handleCloseVariantImagePicker();
  };

  const handleClearVariantImage = () => {
    if (variantImagePickerIndex === null) return;
    handleVariantChange(variantImagePickerIndex, "image", null);
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
    <form onSubmit={onFormSubmit} className="space-y-6">
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
                  className={cn(
                    errors.name && "border-red-500 focus-visible:ring-red-500"
                  )}
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
                  className={cn(
                    errors.slug && "border-red-500 focus-visible:ring-red-500"
                  )}
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
                    className={cn(
                      errors.price && "border-red-500 focus-visible:ring-red-500"
                    )}
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
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                Tồn kho sản phẩm được tính từ biến thể:{" "}
                <span className="font-semibold">{totalVariantStock}</span>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <Dropzone
                value={images}
                onChange={handleImagesChange}
                featuredImage={featuredImage}
                onFeaturedChange={handleFeaturedChange}
                maxFiles={10}
                maxSizeMB={5}
              />
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
                        <Label className="text-xs">Tên biến thể</Label>
                        <Input
                          placeholder="VD: Nhỏ (S)"
                          value={variant.name}
                          onChange={(e) =>
                            handleVariantChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">SKU</Label>
                        <Input
                          placeholder="Mã SKU"
                          value={variant.sku}
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
                      <div>
                        <Label className="text-xs">Ảnh biến thể</Label>
                        {variant.image ? (
                          <button
                            type="button"
                            onClick={() => handleOpenVariantImagePicker(index)}
                            className="group flex w-full items-center gap-2 rounded-md border border-slate-200 bg-white p-2 text-left transition-colors hover:border-brand-300"
                          >
                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-100">
                              <img
                                src={normalizeImageSrc(variant.image) || variant.image}
                                alt={variant.name || "Variant image"}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="text-xs text-slate-600 group-hover:text-brand-600">
                              Chọn lại ảnh
                            </span>
                          </button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={images.length === 0}
                            onClick={() => handleOpenVariantImagePicker(index)}
                          >
                            <ImageIcon className="h-4 w-4" />
                            Chọn ảnh
                          </Button>
                        )}
                        {images.length === 0 && (
                          <p className="mt-1 text-xs text-slate-500">
                            Cần thêm ảnh sản phẩm trước khi chọn ảnh biến thể.
                          </p>
                        )}
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

      <Dialog
        open={variantImagePickerIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseVariantImagePicker();
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chọn ảnh cho biến thể</DialogTitle>
          </DialogHeader>
          {images.length === 0 ? (
            <p className="text-sm text-slate-500">
              Chưa có ảnh sản phẩm để chọn.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((imageUrl) => {
                const isSelected = selectedVariant?.image === imageUrl;
                return (
                  <button
                    key={imageUrl}
                    type="button"
                    onClick={() => handleSelectVariantImage(imageUrl)}
                    className={cn(
                      "overflow-hidden rounded-lg border bg-white text-left transition-colors",
                      isSelected
                        ? "border-brand-500 ring-2 ring-brand-200"
                        : "border-slate-200 hover:border-brand-300"
                    )}
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                      <img
                        src={normalizeImageSrc(imageUrl) || imageUrl}
                        alt="Ảnh sản phẩm"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="truncate px-2 py-1 text-xs text-slate-600">
                      {imageUrl}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearVariantImage}
              disabled={!selectedVariant?.image}
            >
              Xóa ảnh
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseVariantImagePicker}
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
