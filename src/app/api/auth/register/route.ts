export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { signUserToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()
    if (!email || !password) return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Ya existe una cuenta con ese email" }, { status: 400 })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, passwordHash: hash, fullName: fullName || null } })

    const token = await signUserToken({ sub: user.id, email: user.email, name: user.fullName })
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, fullName: user.fullName } })
    response.cookies.set("user_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" })
    return response
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Error interno", debug: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
