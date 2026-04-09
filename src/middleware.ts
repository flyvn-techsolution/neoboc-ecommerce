import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoginPage = pathname.startsWith("/admin/login")

  if (isLoginPage) {
    if (req.auth?.user) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  if (!req.auth) {
    const url = new URL("/admin/login", req.nextUrl.origin)
    url.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
