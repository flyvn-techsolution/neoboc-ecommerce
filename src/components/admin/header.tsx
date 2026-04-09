import { auth } from "@/lib/auth"
import { AdminHeaderClient } from "./header-client"

interface AdminHeaderServerProps {
  onMenuClick: () => void
}

export async function AdminHeader({ onMenuClick }: AdminHeaderServerProps) {
  const session = await auth()

  return (
    <AdminHeaderClient
      user={session?.user ? { name: session.user.name, email: session.user.email } : null}
      onMenuClick={onMenuClick}
    />
  )
}
