"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { AdminHeaderClient } from "./header-client"
import { cn } from "@/lib/utils/format"

const AdminSidebar = dynamic(
  () => import("./sidebar").then((mod) => mod.AdminSidebar),
  { ssr: false }
)

interface DashboardShellProps {
  user: { name?: string | null; email?: string | null } | null
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className={cn("flex flex-col sidebar-transition lg:pl-[260px]")}>
        <AdminHeaderClient
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
