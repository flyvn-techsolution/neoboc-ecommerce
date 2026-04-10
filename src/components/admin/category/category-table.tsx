"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Pencil,
  Trash2,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils/format";
import type { Category, CategoryFilters } from "@/types/category";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryTableProps {
  categories: Category[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  isLoading?: boolean;
  onFiltersChange: (filters: CategoryFilters) => void;
  onDeleteCategory: (id: string) => void;
  isDeleting?: boolean;
}

const SORT_OPTIONS = [
  { value: "createdAt", label: "Ngày tạo" },
  { value: "name", label: "Tên phân loại" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "true", label: "Đang hiển thị" },
  { value: "false", label: "Đã ẩn" },
];

export function CategoryTable({
  categories,
  pagination,
  isLoading,
  onFiltersChange,
  onDeleteCategory,
  isDeleting,
}: CategoryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>(
    searchParams.get("sortBy")
      ? [
          {
            id: searchParams.get("sortBy") as string,
            desc: searchParams.get("sortOrder") === "asc",
          },
        ]
      : []
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("isActive") || ""
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleSortChange = (columnId: string) => {
    const newSorting = [{ id: columnId, desc: sorting[0]?.id === columnId ? !sorting[0].desc : false }];
    setSorting(newSorting);
    onFiltersChange({
      ...getCurrentFilters(),
      sortBy: columnId as "createdAt" | "name",
      sortOrder: newSorting[0].desc ? "desc" as const : "asc" as const,
    });
  };

  const getCurrentFilters = (): CategoryFilters => ({
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "10"),
    sortBy: (searchParams.get("sortBy") as CategoryFilters["sortBy"]) || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    search: searchParams.get("search") || undefined,
    isActive:
      searchParams.get("isActive") === "true"
        ? true
        : searchParams.get("isActive") === "false"
        ? false
        : undefined,
  });

  const handleSearch = () => {
    onFiltersChange({ ...getCurrentFilters(), search, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFiltersChange({
      ...getCurrentFilters(),
      isActive: value === "true" ? true : value === "false" ? false : undefined,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    onFiltersChange({ ...getCurrentFilters(), page: newPage });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onFiltersChange({ ...getCurrentFilters(), pageSize: newPageSize, page: 1 });
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-slate-900"
          onClick={() => handleSortChange("name")}
        >
          Tên phân loại
          {sorting[0]?.id === "name" ? (
            sorting[0].desc ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
          )}
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <Tag className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.original.name}</p>
            <p className="text-xs text-slate-500">{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "_count.products",
      header: "Sản phẩm",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original._count?.products || 0}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? "success" : "secondary"}
          className={cn(
            row.original.isActive
              ? "bg-green-100 text-green-800"
              : "bg-slate-100 text-slate-600"
          )}
        >
          {row.original.isActive ? "Đang hiển thị" : "Đã ẩn"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <button
          className="flex items-center gap-1 hover:text-slate-900"
          onClick={() => handleSortChange("createdAt")}
        >
          Ngày tạo
          {sorting[0]?.id === "createdAt" ? (
            sorting[0].desc ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
          )}
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-slate-500">
          {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            asChild
          >
            <Link href={`/admin/categories/${row.original.id}`}>
              <Pencil className="h-4 w-4 text-slate-500" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleDeleteClick(row.original)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm kiếm phân loại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                onFiltersChange({ ...getCurrentFilters(), search: undefined, page: 1 });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Button asChild className="h-10">
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm phân loại
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-slate-600">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Tag className="mb-2 h-8 w-8 text-slate-300" />
                    <p>Không có phân loại nào</p>
                    <p className="mt-1 text-sm">
                      <Link
                        href="/admin/categories/new"
                        className="text-brand-500 hover:underline"
                      >
                        Thêm phân loại mới
                      </Link>
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Hiển thị</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-sm"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-slate-500">
            / {pagination.total} phân loại
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(1)}
            disabled={pagination.page <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 px-2">
            <Input
              type="number"
              min={1}
              max={pagination.totalPages}
              value={pagination.page}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= pagination.totalPages) {
                  handlePageChange(page);
                }
              }}
              className="h-8 w-14 text-center"
            />
            <span className="text-sm text-slate-500">
              / {pagination.totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa phân loại</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phân loại{" "}
              <strong>{categoryToDelete?.name}</strong> không? Hành động này
              không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
