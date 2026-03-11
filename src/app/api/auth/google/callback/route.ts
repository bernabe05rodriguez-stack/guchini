export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { signUserToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const code = request.nextUrl.searchParams.get("code")
  const redirect = request.nextUrl.searchParams.get("state") || "/"

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/auth/login?error=google_failed`)
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    })

    const tokens = await tokenRes.json()
    if (!tokens.access_token) {
      return NextResponse.redirect(`${baseUrl}/auth/login?error=google_failed`)
    }

    // Get user info
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const googleUser = await userInfoRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/auth/login?error=google_failed`)
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: googleUser.id }, { email: googleUser.email }] },
    })

    if (user) {
      // Link Google ID if not already linked
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleUser.id, fullName: user.fullName || googleUser.name },
        })
      }
    } else {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          fullName: googleUser.name || null,
          googleId: googleUser.id,
        },
      })
    }

    const token = await signUserToken({ sub: user.id, email: user.email, name: user.fullName })
    const response = NextResponse.redirect(`${baseUrl}${redirect}`)
    response.cookies.set("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    return response
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(`${baseUrl}/auth/login?error=google_failed`)
  }
}
