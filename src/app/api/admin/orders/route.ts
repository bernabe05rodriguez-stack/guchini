export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminFromCookie } from "@/lib/auth"

export async function GET() {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const orders = await prisma.order.findMany({
      where: { status: { not: "pending" } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { items: true, user: { select: { fullName: true, email: true } } },
    })
    return NextResponse.json(orders.map(o => ({
      ...o, order_number: o.orderNumber, created_at: o.createdAt, updated_at: o.updatedAt,
      estimated_wait_minutes: o.estimatedWaitMinutes,
      customer_name: o.user?.fullName || o.user?.email || "Cliente",
      order_items: o.items.map(i => ({ ...i, item_type: i.itemType, item_id: i.itemId, item_name: i.itemName, unit_price: i.unitPrice, order_id: i.orderId })),
    })))
  } catch (error) {
    console.error("Admin orders error:", error)
    return NextResponse.json([])
  }
}
