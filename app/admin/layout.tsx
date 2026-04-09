import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "../../src/components/admin/sidebar"
import { AdminHeader } from "../../src/components/admin/header"
import { cn } from "../../src/lib/utils/format"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Allow access to login page without redirect
  // but redirect all other /admin/* pages if not authenticated
  // This is handled by middleware, but as a fallback
  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={false} onClose={() => {}} />

      {/* Main content area */}
      <div className={cn("flex flex-col sidebar-transition lg:pl-[260px]")}>
        {/* Header */}
        <AdminHeader onMenuClick={() => {}} />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
