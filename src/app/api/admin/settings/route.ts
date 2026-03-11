export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminFromCookie } from "@/lib/auth"

export async function GET() {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const data = await prisma.setting.findMany()
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const settings: Array<{ key: string; value: string }> = await request.json()
    for (const s of settings) {
      await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: { key: s.key, value: s.value } })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Settings error:", error)
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}
