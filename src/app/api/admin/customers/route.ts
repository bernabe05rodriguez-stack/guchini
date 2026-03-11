export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminFromCookie } from "@/lib/auth"

export async function GET() {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const data = await prisma.user.findMany({ orderBy: { totalOrders: "desc" } })
    return NextResponse.json(data.map(u => ({ ...u, full_name: u.fullName, avatar_url: null, total_orders: u.totalOrders, total_spent: u.totalSpent, created_at: u.createdAt })))
  } catch (error) {
    console.error("Admin customers error:", error)
    return NextResponse.json([])
  }
}
