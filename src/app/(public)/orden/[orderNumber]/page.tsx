"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, MapPin, Clock, Copy, ChefHat, Bell, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ConfettiTrigger } from "@/components/confetti-trigger"
import { formatPrice } from "@/lib/utils"
import { STORE_ADDRESS } from "@/lib/constants"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import type { OrderWithItems } from "@/types/database"

const STATUS_CONFIG = {
  paid: {
    icon: CheckCircle2,
    title: "Pedido confirmado",
    subtitle: "Tu pedido fue recibido y pronto comenzará a prepararse",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    step: 1,
  },
  preparing: {
    icon: ChefHat,
    title: "Preparando tu pedido",
    subtitle: "Nuestro equipo está preparando tu sanguche",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    step: 2,
  },
  ready: {
    icon: Bell,
    title: "¡Tu pedido está listo!",
    subtitle: "Pasá a retirarlo por el local",
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-300",
    step: 3,
  },
  delivered: {
    icon: Package,
    title: "Pedido entregado",
    subtitle: "¡Gracias por elegirnos!",
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    step: 4,
  },
} as const

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [prevStatus, setPrevStatus] = useState<string | null>(null)
  const { clearCart } = useCart()

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`)
      const data = await res.json()
      if (data.status && prevStatus && data.status !== prevStatus) {
        if (data.status === "ready") {
          toast.success("¡Tu pedido está listo! Pasá a retirarlo")
        } else if (data.status === "preparing") {
          toast.info("Tu pedido se está preparando")
        }
      }
      setPrevStatus(data.status)
      setOrder(data)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }, [orderNumber, prevStatus])

  useEffect(() => {
    clearCart()
  }, [clearCart])

  useEffect(() => {
    fetchOrder()
    const interval = setInterval(fetchOrder, 5000)
    return () => clearInterval(interval)
  }, [fetchOrder])

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

  const isPaid = ["paid", "preparing", "ready", "delivered"].includes(order.status)
  const statusKey = order.status as keyof typeof STATUS_CONFIG
  const config = STATUS_CONFIG[statusKey]
  const StatusIcon = config?.icon || CheckCircle2

  return (
    <div className="container max-w-lg py-8 space-y-6">
      {isPaid && order.status === "paid" && <ConfettiTrigger />}

      {/* Status header */}
      <div className="text-center space-y-3">
        <StatusIcon className={`h-16 w-16 mx-auto ${config?.color || "text-green-500"} ${order.status === "ready" ? "animate-bounce" : ""}`} />
        <h1 className="text-2xl font-display font-bold">
          {config?.title || "Pedido registrado"}
        </h1>
        <p className="text-muted-foreground">{config?.subtitle}</p>
      </div>

      {/* Progress steps */}
      {isPaid && config && (
        <div className="flex items-center justify-center gap-2 px-4">
          {["Confirmado", "Preparando", "Listo", "Entregado"].map((label, i) => {
            const stepNum = i + 1
            const isActive = config.step >= stepNum
            return (
              <div key={label} className="flex-1 text-center">
                <div className={`h-2 rounded-full mb-1 transition-colors ${isActive ? "bg-olive" : "bg-gray-200"}`} />
                <span className={`text-[10px] ${isActive ? "text-olive font-medium" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Order number */}
      <Card className={`border-2 ${config?.border || "border-olive"} ${config?.bg || "bg-white"}`}>
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

      {/* Ready alert */}
      {order.status === "ready" && (
        <Card className="border-2 border-green-400 bg-green-50">
          <CardContent className="py-6 text-center space-y-2">
            <Bell className="h-10 w-10 text-green-500 mx-auto animate-bounce" />
            <p className="text-xl font-display font-bold text-green-700">
              ¡Pasá a retirarlo!
            </p>
            <p className="text-sm text-green-600">
              Mostrá el número <span className="font-bold">{orderNumber}</span> en el local
            </p>
          </CardContent>
        </Card>
      )}

      {/* Wait time - only show if not ready/delivered */}
      {order.estimated_wait_minutes && !["ready", "delivered"].includes(order.status) && (
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
      {!["ready", "delivered"].includes(order.status) && (
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <MapPin className="h-5 w-5 text-brown" />
            <div>
              <p className="font-medium">Retirá en el local</p>
              <p className="text-sm text-muted-foreground">{STORE_ADDRESS}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order details */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <h3 className="font-display font-bold">Detalle del pedido</h3>
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>x{item.quantity} {item.item_name}</span>
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
