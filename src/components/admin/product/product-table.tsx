"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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
import { Select } from "@/components/ui/select";
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
  ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn, formatCurrency, toImageArray } from "@/lib/utils/format";
import type { Product, ProductFilters } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductTableProps {
  products: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  isLoading?: boolean;
  onFiltersChange: (filters: ProductFilters) => void;
  onDeleteProduct: (id: string) => void;
  isDeleting?: boolean;
}

const SORT_OPTIONS = [
  { value: "createdAt", label: "Ngày tạo" },
  { value: "name", label: "Tên sản phẩm" },
  { value: "price", label: "Giá" },
  { value: "stock", label: "Tồn kho" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "true", label: "Đang bán" },
  { value: "false", label: "Đã ẩn" },
];

export function ProductTable({
  products,
  pagination,
  isLoading,
  onFiltersChange,
  onDeleteProduct,
  isDeleting,
}: ProductTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
  );
  const [isActive, setIsActive] = useState(
    searchParams.get("isActive") || ""
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        accessorKey: "images",
        header: "Hình ảnh",
        cell: ({ row }) => {
          const firstImage = toImageArray(row.original.images)[0] ?? null;
          return (
            <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {firstImage ? (
                <Image
                  src={firstImage}
                  alt={row.original.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-slate-400" />
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Sản phẩm",
        cell: ({ row }) => {
          const { name, slug, _count } = row.original;
          return (
            <div className="max-w-[250px]">
              <p className="font-medium text-slate-900 truncate">{name}</p>
              <p className="text-xs text-slate-500">{slug}</p>
              {_count && _count.orderItems > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {_count.orderItems} đơn hàng
                </p>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Giá",
        cell: ({ row }) => {
          const { price, originalPrice, salePrice } = row.original;
          if (salePrice) {
            return (
              <div className="space-y-0.5">
                <p className="font-medium text-red-600">
                  {formatCurrency(salePrice)}
                </p>
                <p className="text-xs text-slate-400 line-through">
                  {formatCurrency(price)}
                </p>
              </div>
            );
          }
          if (originalPrice && originalPrice > price) {
            return (
              <div className="space-y-0.5">
                <p className="font-medium">{formatCurrency(price)}</p>
                <p className="text-xs text-slate-400 line-through">
                  {formatCurrency(originalPrice)}
                </p>
              </div>
            );
          }
          return <p className="font-medium">{formatCurrency(price)}</p>;
        },
      },
      {
        accessorKey: "stock",
        header: "Tồn kho",
        cell: ({ row }) => {
          const stock = row.original.stock;
          return (
            <span
              className={cn(
                "font-medium",
                stock === 0
                  ? "text-red-600"
                  : stock < 10
                  ? "text-amber-600"
                  : "text-slate-700"
              )}
            >
              {stock}
            </span>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          return (
            <Badge variant={isActive ? "success" : "secondary"}>
              {isActive ? "Đang bán" : "Đã ẩn"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "categories",
        header: "Danh mục",
        cell: ({ row }) => {
          const categories = row.original.categories;
          if (!categories?.length) return "-";
          return (
            <div className="flex flex-wrap gap-1">
              {categories.slice(0, 2).map((cat) => (
                <Badge key={cat.id} variant="outline" className="text-xs">
                  {cat.name}
                </Badge>
              ))}
              {categories.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{categories.length - 2}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center gap-1">
              <Link href={`/admin/products/${product.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  setProductToDelete(product);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const sorting: SortingState = useMemo(
    () => [{ id: sortBy, desc: sortOrder === "desc" }],
    [sortBy, sortOrder]
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchSubmit = () => {
    onFiltersChange({
      search: searchValue,
      sortBy: sortBy as ProductFilters["sortBy"],
      sortOrder,
      isActive: isActive === "" ? undefined : isActive === "true",
    });
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
      onFiltersChange({
        search: searchValue,
        sortBy: newSortBy as ProductFilters["sortBy"],
        sortOrder: newOrder,
        isActive: isActive === "" ? undefined : isActive === "true",
      });
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
      onFiltersChange({
        search: searchValue,
        sortBy: newSortBy as ProductFilters["sortBy"],
        sortOrder: "desc",
        isActive: isActive === "" ? undefined : isActive === "true",
      });
    }
  };

  const handleStatusChange = (value: string) => {
    setIsActive(value);
    onFiltersChange({
      search: searchValue,
      sortBy: sortBy as ProductFilters["sortBy"],
      sortOrder,
      isActive: value === "" ? undefined : value === "true",
    });
  };

  const handlePageChange = (newPage: number) => {
    onFiltersChange({
      page: newPage + 1,
      search: searchValue,
      sortBy: sortBy as ProductFilters["sortBy"],
      sortOrder,
      isActive: isActive === "" ? undefined : isActive === "true",
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onFiltersChange({
      pageSize: newPageSize,
      search: searchValue,
      sortBy: sortBy as ProductFilters["sortBy"],
      sortOrder,
      isActive: isActive === "" ? undefined : isActive === "true",
    });
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              className="pl-9"
            />
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue("");
                  onFiltersChange({
                    sortBy: sortBy as ProductFilters["sortBy"],
                    sortOrder,
                    isActive: isActive === "" ? undefined : isActive === "true",
                  });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Select
            options={STATUS_OPTIONS}
            value={isActive}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-40"
          />
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-50">
                {headerGroup.headers.map((header) => {
                  const isSortable = [
                    "name",
                    "price",
                    "stock",
                    "createdAt",
                  ].includes(header.id);
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-12 px-4 text-xs font-semibold uppercase tracking-wider text-slate-600",
                        isSortable && "cursor-pointer select-none hover:bg-slate-100"
                      )}
                      onClick={() => {
                        if (isSortable) {
                          handleSortChange(header.id);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSortable && (
                          <span className="text-slate-400">
                            {header.id === sortBy ? (
                              sortOrder === "asc" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex} className="h-14 px-4">
                      <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-14 border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-slate-500"
                >
                  Không có sản phẩm nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Hiển thị</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>mục / trang</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(0)}
              disabled={pagination.page === 1}
              className="hidden h-8 w-8 p-0 sm:flex"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 px-2">
              <span className="text-sm text-slate-600">Trang</span>
              <span className="font-medium">{pagination.page}</span>
              <span className="text-sm text-slate-600">/</span>
              <span className="font-medium">{pagination.totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
              className="hidden h-8 w-8 p-0 sm:flex"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-slate-500 text-center">
        Hiển thị {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
        {Math.min(pagination.page * pagination.pageSize, pagination.total)} trong
        tổng số {pagination.total} sản phẩm
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>{productToDelete?.name}</strong>? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
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
