export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Cài đặt</h1>
        <p className="mt-1 text-sm text-slate-500">
          Cấu hình cài đặt hệ thống
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            <a
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600"
            >
              Cài đặt chung
            </a>
            <a
              href="/admin/settings/seo"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              SEO
            </a>
            <a
              href="/admin/settings/payment"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Thanh toán
            </a>
            <a
              href="/admin/settings/social"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Social Links
            </a>
          </nav>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Cài đặt chung</h2>
            <p className="mt-1 text-sm text-slate-500">
              Trang cài đặt chung đang được phát triển...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
