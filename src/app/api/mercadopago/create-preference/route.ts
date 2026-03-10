export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyUserToken } from "@/lib/auth"
import { getPreferenceClient } from "@/lib/mercadopago"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("user_token")?.value
    if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    const userData = await verifyUserToken(token)
    if (!userData) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { orderId, orderNumber } = await request.json()
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
    if (!order) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const preference = await getPreferenceClient().create({
      body: {
        items: order.items.map(item => ({ id: item.itemId, title: item.itemName, quantity: item.quantity, unit_price: Number(item.unitPrice), currency_id: "ARS" })),
        payer: { name: userData.name || "", email: userData.email },
        back_urls: { success: `${baseUrl}/pago/success?order=${orderNumber}`, failure: `${baseUrl}/pago/failure?order=${orderNumber}`, pending: `${baseUrl}/pago/pending?order=${orderNumber}` },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        external_reference: orderNumber,
        statement_descriptor: "GUCHINI",
      },
    })

    await prisma.order.update({ where: { id: orderId }, data: { mpPreferenceId: preference.id } })
    return NextResponse.json({ id: preference.id, init_point: preference.init_point })
  } catch (error) {
    console.error("MP error:", error)
    return NextResponse.json({ error: "Error MercadoPago" }, { status: 500 })
  }
}
