export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getPaymentClient } from "@/lib/mercadopago"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (body.type !== "payment" && body.action !== "payment.created" && body.action !== "payment.updated") return NextResponse.json({ received: true })

    const paymentId = body.data?.id
    if (!paymentId) return NextResponse.json({ received: true })

    // Validate webhook signature if secret is configured
    const webhookSecret = process.env.MP_WEBHOOK_SECRET
    if (webhookSecret) {
      const xSignature = request.headers.get("x-signature")
      const xRequestId = request.headers.get("x-request-id")
      if (!xSignature || !xRequestId) {
        console.error("Webhook: missing signature headers")
        return NextResponse.json({ error: "Missing signature" }, { status: 401 })
      }
      const parts = Object.fromEntries(xSignature.split(",").map(p => { const [k, ...v] = p.trim().split("="); return [k, v.join("=")] }))
      const ts = parts.ts
      const v1 = parts.v1
      const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`
      const hmac = crypto.createHmac("sha256", webhookSecret).update(manifest).digest("hex")
      if (hmac !== v1) {
        console.error("Webhook: invalid signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
      }
    } else {
      console.warn("MP_WEBHOOK_SECRET no configurado - webhook sin validación de firma")
    }

    const payment = await getPaymentClient().get({ id: paymentId })
    if (!payment || !payment.external_reference) return NextResponse.json({ received: true })

    let orderStatus = "pending"
    switch (payment.status) {
      case "approved": orderStatus = "paid"; break
      case "rejected":
      case "cancelled":
      case "refunded":
      case "charged_back": orderStatus = "cancelled"; break
      case "in_process":
      case "in_mediation":
      case "pending": orderStatus = "pending"; break
      default: orderStatus = "pending"
    }

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
