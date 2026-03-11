export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { signUserToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })

    if (!user.passwordHash) {
      return NextResponse.json({ error: "Esta cuenta usa Google. Iniciá sesión con Google." }, { status: 400 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })

    const token = await signUserToken({ sub: user.id, email: user.email, name: user.fullName })
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, fullName: user.fullName } })
    response.cookies.set("user_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" })
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
