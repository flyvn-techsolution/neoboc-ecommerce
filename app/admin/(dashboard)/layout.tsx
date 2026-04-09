import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardShell } from "@/components/admin/dashboard-shell"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    >
      {children}
    </DashboardShell>
  )
}
