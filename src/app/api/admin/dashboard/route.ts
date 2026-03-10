export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [todayOrders, pendingCount, customerCount, recentOrders] = await Promise.all([
      prisma.order.findMany({ where: { createdAt: { gte: todayStart }, status: { in: ["paid", "preparing", "ready", "delivered"] } }, select: { total: true } }),
      prisma.order.count({ where: { status: { in: ["paid", "preparing"] } } }),
      prisma.user.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, orderNumber: true, status: true, total: true, createdAt: true } }),
    ])

    return NextResponse.json({
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total), 0),
      pendingOrders: pendingCount,
      totalCustomers: customerCount,
      recentOrders: recentOrders.map(o => ({ ...o, order_number: o.orderNumber, created_at: o.createdAt })),
    })
  } catch { return NextResponse.json({ todayOrders: 0, todayRevenue: 0, pendingOrders: 0, totalCustomers: 0, recentOrders: [] }) }
}
