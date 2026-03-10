import { NextResponse, type NextRequest } from "next/server"
import { verifyUserToken, verifyAdminToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected customer routes
  if (pathname.startsWith("/checkout")) {
    const token = request.cookies.get("user_token")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?redirect=/checkout", request.url))
    }
    const user = await verifyUserToken(token)
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login?redirect=/checkout", request.url))
    }
  }

  // Admin routes protection
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/admin/:path*",
  ],
}
