export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const data = await prisma.setting.findMany()
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  try {
    const settings: Array<{ key: string; value: string }> = await request.json()
    for (const s of settings) {
      await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: { key: s.key, value: s.value } })
    }
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Error al guardar" }, { status: 500 }) }
}
