"use client";

import * as React from "react";
import { Upload, X, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils/format";
import { Button } from "./button";

interface DropzoneProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  featuredImage?: string | null;
  onFeaturedChange?: (url: string | null) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function Dropzone({
  value = [],
  onChange,
  featuredImage,
  onFeaturedChange,
  maxFiles = 10,
  maxSizeMB = 5,
  className,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadingFiles, setUploadingFiles] = React.useState<UploadingFile[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ALLOWED_TYPES.includes(f.type)
    );
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      ALLOWED_TYPES.includes(f.type)
    );
    handleFiles(files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFiles = async (files: File[]) => {
    if (value.length + files.length > maxFiles) {
      setError(`Tối đa ${maxFiles} ảnh`);
      return;
    }

    const validFiles = files.filter((f) => {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File "${f.name}" vượt quá ${maxSizeMB}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newUploads: UploadingFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploads]);
    setError(null);

    for (const upload of newUploads) {
      await uploadFile(upload);
    }
  };

  const uploadFile = async (upload: UploadingFile) => {
    const formData = new FormData();
    formData.append("files", upload.file);

    try {
      for (let i = 0; i <= 80; i += 20) {
        await new Promise((r) => setTimeout(r, 100));
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === upload.id ? { ...f, progress: i } : f))
        );
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === upload.id ? { ...f, progress: 100, error: data.error } : f
          )
        );
        return;
      }

      const newUrl = data.urls[0];
      URL.revokeObjectURL(upload.preview);

      const updated = [...value, newUrl];
      setUploadingFiles((prev) => prev.filter((f) => f.id !== upload.id));
      onChange?.(updated);

      if (!featuredImage) {
        onFeaturedChange?.(newUrl);
      }
    } catch {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === upload.id ? { ...f, progress: 100, error: "Lỗi upload" } : f
        )
      );
    }
  };

  const handleRemove = (url: string) => {
    const updated = value.filter((u) => u !== url);
    onChange?.(updated);
    if (featuredImage === url) {
      onFeaturedChange?.(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleSetFeatured = (url: string) => {
    onFeaturedChange?.(url);
  };

  React.useEffect(() => {
    return () => {
      uploadingFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Uploaded Images Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {value.map((url) => {
            const isFeatured = featuredImage === url;

            return (
              <div
                key={url}
                className={cn(
                  "relative aspect-square rounded-lg border overflow-hidden bg-slate-100 group",
                  isFeatured
                    ? "border-brand-500 ring-2 ring-brand-500 ring-offset-1"
                    : "border-slate-200"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Product image"
                  className="w-full h-full object-cover"
                />

                {/* Radio Button - Featured */}
                <button
                  type="button"
                  onClick={() => handleSetFeatured(url)}
                  className={cn(
                    "absolute top-1 left-1 h-6 w-6 rounded-full flex items-center justify-center transition-colors",
                    isFeatured
                      ? "bg-brand-500 text-white"
                      : "bg-white/80 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-brand-50"
                  )}
                  title={isFeatured ? "Ảnh chính" : "Chọn làm ảnh chính"}
                >
                  {isFeatured ? (
                    <Star className="h-3 w-3 fill-current" />
                  ) : (
                    <Star className="h-3 w-3" />
                  )}
                </button>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Featured Label */}
                {isFeatured && (
                  <span className="absolute bottom-1 left-1 bg-brand-500 text-white text-xs px-1.5 py-0.5 rounded">
                    Ảnh chính
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors text-center",
          isDragging
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 hover:border-brand-400 hover:bg-slate-50",
          value.length > 0 && "mt-3"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isDragging ? "bg-brand-100 text-brand-500" : "bg-slate-100 text-slate-400"
            )}
          >
            <Upload className="h-5 w-5" />
          </div>
          <div className="text-sm">
            <span className="text-brand-500 font-medium">Nhấn để tải ảnh lên</span>
            {" hoặc kéo thả vào đây"}
          </div>
          <p className="text-xs text-slate-400">
            JPEG, PNG, GIF, WebP · Tối đa {maxSizeMB}MB/ảnh · Tối đa {maxFiles} ảnh
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <>
          <p className="text-sm text-red-500">{error}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setError(null);
            }}
            className="text-red-500 hover:text-red-600"
          >
            Xóa thông báo lỗi
          </Button>
        </>
      )}

      {/* Uploading Previews */}
      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {uploadingFiles.map((upload) => (
            <div
              key={upload.id}
              className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={upload.preview}
                alt="Uploading"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {upload.error ? (
                  <div className="text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <p className="text-xs text-red-500 px-1">{upload.error}</p>
                  </div>
                ) : (
                  <Loader2 className="h-5 w-5 text-brand-500 animate-spin" />
                )}
              </div>
              {!upload.error && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                  <div
                    className="h-full bg-brand-500 transition-all"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
