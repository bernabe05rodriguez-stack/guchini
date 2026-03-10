export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const order = await prisma.order.findUnique({ where: { orderNumber: params.orderNumber }, include: { items: true } })
    if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    return NextResponse.json({
      ...order, order_number: order.orderNumber, created_at: order.createdAt,
      estimated_wait_minutes: order.estimatedWaitMinutes,
      order_items: order.items.map(i => ({ ...i, item_type: i.itemType, item_id: i.itemId, item_name: i.itemName, unit_price: i.unitPrice })),
    })
  } catch { return NextResponse.json({ error: "Error" }, { status: 500 }) }
}

export async function PATCH(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const body = await request.json()
    const data = await prisma.order.update({ where: { orderNumber: params.orderNumber }, data: { status: body.status } })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Error" }, { status: 500 }) }
}
