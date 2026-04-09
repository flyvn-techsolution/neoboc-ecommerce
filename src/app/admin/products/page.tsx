export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Sản phẩm</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý danh sách sản phẩm
          </p>
        </div>
        <a
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600"
        >
          Thêm sản phẩm mới
        </a>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-500">Trang quản lý sản phẩm đang được phát triển...</p>
      </div>
    </div>
  );
}
