export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const data = await prisma.user.findMany({ orderBy: { totalOrders: "desc" } })
  return NextResponse.json(data.map(u => ({ ...u, full_name: u.fullName, avatar_url: null, total_orders: u.totalOrders, total_spent: u.totalSpent, created_at: u.createdAt })))
}
