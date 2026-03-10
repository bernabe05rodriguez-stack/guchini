export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({ where: { key: { in: ["base_wait_minutes", "wait_per_order"] } } })
    const base = parseInt(settings.find(s => s.key === "base_wait_minutes")?.value || "7")
    const perOrder = parseInt(settings.find(s => s.key === "wait_per_order")?.value || "2")

    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)
    const queueCount = await prisma.order.count({ where: { status: { in: ["paid", "preparing"] }, createdAt: { gte: thirtyMinAgo } } })

    return NextResponse.json({ minutes: base + (queueCount * perOrder) })
  } catch { return NextResponse.json({ minutes: 12 }) }
}
