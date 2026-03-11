export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { not: "pending" } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { items: true },
    })
    // Map to snake_case for frontend compatibility
    return NextResponse.json(orders.map(o => ({
      ...o, order_number: o.orderNumber, created_at: o.createdAt, updated_at: o.updatedAt,
      estimated_wait_minutes: o.estimatedWaitMinutes,
      order_items: o.items.map(i => ({ ...i, item_type: i.itemType, item_id: i.itemId, item_name: i.itemName, unit_price: i.unitPrice, order_id: i.orderId })),
    })))
  } catch { return NextResponse.json([]) }
}
