export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { signAdminToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    if (!username || !password) return NextResponse.json({ error: "Credenciales requeridas" }, { status: 400 })

    const admin = await prisma.adminUser.findUnique({ where: { username } })

    let isValid = false
    if (admin) {
      isValid = await bcrypt.compare(password, admin.passwordHash)
    }
    // Fallback to env vars
    if (!isValid) {
      isValid = username === (process.env.ADMIN_USERNAME || "guchini-admin") && password === (process.env.ADMIN_PASSWORD || "12345678")
    }
    if (!isValid) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })

    const token = await signAdminToken({ sub: admin?.id || "env-admin", username })
    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24, path: "/" })
    return response
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("admin_token", "", { httpOnly: true, maxAge: 0, path: "/" })
  return response
}
