export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyUserToken } from "@/lib/auth"
import { generateOrderNumber } from "@/lib/utils"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("user_token")?.value
    if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    const userData = await verifyUserToken(token)
    if (!userData) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { ok } = rateLimit(`orders:${userData.sub}`, 10, 60_000)
    if (!ok) return NextResponse.json({ error: "Demasiados pedidos. Esperá un minuto." }, { status: 429 })

    const body = await request.json()
    const { items, notes, estimated_wait_minutes } = body
    if (!items || items.length === 0) return NextResponse.json({ error: "Carrito vacío" }, { status: 400 })

    // Server-side price validation
    const enrichedItems = []
    for (const item of items) {
      if (!item.item_id || !item.item_type || !item.quantity || item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return NextResponse.json({ error: "Item inválido" }, { status: 400 })
      }
      if (item.quantity > 50) {
        return NextResponse.json({ error: "Cantidad máxima por item: 50" }, { status: 400 })
      }

      let dbItem: { price: number; name: string; available: boolean } | null = null
      if (item.item_type === "sandwich") {
        const s = await prisma.sandwich.findUnique({ where: { id: item.item_id }, select: { price: true, name: true, available: true } })
        if (s) dbItem = { price: Number(s.price), name: s.name, available: s.available }
      } else if (item.item_type === "drink") {
        const d = await prisma.drink.findUnique({ where: { id: item.item_id }, select: { price: true, name: true, available: true } })
        if (d) dbItem = { price: Number(d.price), name: d.name, available: d.available }
      } else {
        return NextResponse.json({ error: "Tipo de item inválido" }, { status: 400 })
      }

      if (!dbItem) return NextResponse.json({ error: `Item no encontrado: ${item.item_id}` }, { status: 400 })
      if (!dbItem.available) return NextResponse.json({ error: `"${dbItem.name}" no está disponible` }, { status: 400 })

      enrichedItems.push({
        itemType: item.item_type,
        itemId: item.item_id,
        itemName: dbItem.name,
        quantity: item.quantity,
        unitPrice: dbItem.price,
        subtotal: dbItem.price * item.quantity,
      })
    }

    const subtotal = enrichedItems.reduce((sum, item) => sum + item.subtotal, 0)
    const count = await prisma.order.count()
    const orderNumber = generateOrderNumber(count)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userData.sub,
        status: "pending",
        subtotal,
        total: subtotal,
        estimatedWaitMinutes: estimated_wait_minutes || null,
        notes: notes || null,
        items: { create: enrichedItems },
      },
      include: { items: true },
    })

    return NextResponse.json({ ...order, order_number: order.orderNumber })
  } catch (error) {
    console.error("Order error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
