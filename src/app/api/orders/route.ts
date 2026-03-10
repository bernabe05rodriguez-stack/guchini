export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyUserToken } from "@/lib/auth"
import { generateOrderNumber } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("user_token")?.value
    if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    const userData = await verifyUserToken(token)
    if (!userData) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const body = await request.json()
    const { items, notes, estimated_wait_minutes } = body
    if (!items || items.length === 0) return NextResponse.json({ error: "Carrito vacío" }, { status: 400 })

    const count = await prisma.order.count()
    const orderNumber = generateOrderNumber(count)

    const subtotal = items.reduce((sum: number, item: { unit_price: number; quantity: number }) => sum + item.unit_price * item.quantity, 0)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userData.sub,
        status: "pending",
        subtotal,
        total: subtotal,
        estimatedWaitMinutes: estimated_wait_minutes || null,
        notes: notes || null,
        items: {
          create: items.map((item: { item_type: string; item_id: string; item_name: string; quantity: number; unit_price: number }) => ({
            itemType: item.item_type,
            itemId: item.item_id,
            itemName: item.item_name,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            subtotal: item.unit_price * item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ ...order, order_number: order.orderNumber })
  } catch (error) {
    console.error("Order error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
