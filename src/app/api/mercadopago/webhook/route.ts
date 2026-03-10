export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getPaymentClient } from "@/lib/mercadopago"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (body.type !== "payment" && body.action !== "payment.created" && body.action !== "payment.updated") return NextResponse.json({ received: true })

    const paymentId = body.data?.id
    if (!paymentId) return NextResponse.json({ received: true })

    const payment = await getPaymentClient().get({ id: paymentId })
    if (!payment || !payment.external_reference) return NextResponse.json({ received: true })

    let orderStatus = "pending"
    if (payment.status === "approved") orderStatus = "paid"
    else if (payment.status === "rejected" || payment.status === "cancelled") orderStatus = "cancelled"

    const order = await prisma.order.update({
      where: { orderNumber: payment.external_reference },
      data: { status: orderStatus, mpPaymentId: String(paymentId), mpStatus: payment.status },
    })

    if (orderStatus === "paid" && order.userId) {
      await prisma.user.update({
        where: { id: order.userId },
        data: { totalOrders: { increment: 1 }, totalSpent: { increment: Number(order.total) } },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
