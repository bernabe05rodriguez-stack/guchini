"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, MapPin, Clock, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ConfettiTrigger } from "@/components/confetti-trigger"
import { formatPrice } from "@/lib/utils"
import { STORE_ADDRESS } from "@/lib/constants"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import type { OrderWithItems } from "@/types/database"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear cart on mount
    clearCart()

    fetch(`/api/orders/${orderNumber}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [orderNumber, clearCart])

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber)
    toast.success("Número de orden copiado")
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground">Pedido no encontrado</p>
        <Button asChild className="mt-4">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    )
  }

  const isPaid = order.status === "paid" || order.status === "preparing" || order.status === "ready"

  return (
    <div className="container max-w-lg py-8 space-y-6">
      {isPaid && <ConfettiTrigger />}

      {/* Header */}
      <div className="text-center space-y-3">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-display font-bold">
          {isPaid ? "¡Pedido confirmado!" : "Pedido registrado"}
        </h1>
      </div>

      {/* Order number - GIANT */}
      <Card className="border-2 border-olive bg-white">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Tu número de orden:</p>
          <div className="text-5xl md:text-7xl font-display font-black text-olive tracking-wider">
            {orderNumber}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 gap-2 text-muted-foreground"
            onClick={copyOrderNumber}
          >
            <Copy className="h-4 w-4" />
            Copiar
          </Button>
        </CardContent>
      </Card>

      {/* Wait time */}
      {order.estimated_wait_minutes && (
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Clock className="h-5 w-5 text-olive" />
            <div>
              <p className="text-sm text-muted-foreground">Tiempo estimado</p>
              <p className="text-xl font-bold text-olive">~{order.estimated_wait_minutes} minutos</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pickup info */}
      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          <MapPin className="h-5 w-5 text-brown" />
          <div>
            <p className="font-medium">Presentá este número en el local</p>
            <p className="text-sm text-muted-foreground">{STORE_ADDRESS}</p>
          </div>
        </CardContent>
      </Card>

      {/* Order details */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <h3 className="font-display font-bold">Detalle del pedido</h3>
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                x{item.quantity} {item.item_name}
              </span>
              <span className="font-medium">{formatPrice(Number(item.subtotal))}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span className="text-olive">{formatPrice(Number(order.total))}</span>
          </div>
        </CardContent>
      </Card>

      {/* Back link */}
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
