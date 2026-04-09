"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  User,
  Settings,
} from "lucide-react"
import { cn } from "../../lib/utils/format"

interface AdminHeaderProps {
  onMenuClick: () => void
  user: { name?: string | null; email?: string | null } | null
}

interface BreadcrumbItem {
  label: string
  href?: string
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split("/").filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ""
  for (let i = 0; i < paths.length; i++) {
    const segment = paths[i]
    currentPath += `/${segment}`

    let label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())

    if (segment === "admin") {
      label = "Dashboard"
    }

    breadcrumbs.push({
      label,
      href: i < paths.length - 1 ? currentPath : undefined,
    })
  }

  return breadcrumbs
}

function getInitials(name?: string | null): string {
  if (!name) return "A"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AdminHeaderClient({ onMenuClick, user }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const breadcrumbs = generateBreadcrumbs(pathname)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
            {item.href ? (
              <Link
                href={item.href}
                className="text-slate-600 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-900">{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <div
          className={cn(
            "absolute right-0 top-full mt-2 w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg",
            isSearchOpen ? "block" : "hidden"
          )}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Search button for mobile */}
      <button
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Notifications */}
      <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-medium text-white"
        >
          {getInitials(user?.name)}
        </button>

        {isUserMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsUserMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-sm font-medium text-slate-900">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || "admin@neoboc.com"}
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/admin/profile"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Hồ sơ
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </Link>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
