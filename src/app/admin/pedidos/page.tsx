"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import { ChefHat, Check, PackageCheck, AlertTriangle, Clock } from "lucide-react"
import type { OrderWithItems } from "@/types/database"

const STATUS_FLOW = {
  paid: { next: "preparing", label: "Pagado", color: "bg-blue-100 text-blue-700", borderColor: "border-blue-500", stripColor: "bg-blue-500" },
  preparing: { next: "ready", label: "Preparando", color: "bg-yellow-100 text-yellow-700", borderColor: "border-yellow-500", stripColor: "bg-yellow-500" },
  ready: { next: "delivered", label: "Listo", color: "bg-green-100 text-green-700", borderColor: "border-green-500", stripColor: "bg-green-500" },
  delivered: { next: null, label: "Entregado", color: "bg-green-50 text-green-600", borderColor: "border-green-300", stripColor: "bg-green-300" },
  pending: { next: null, label: "Pendiente", color: "bg-gray-100 text-gray-700", borderColor: "border-gray-300", stripColor: "bg-gray-300" },
  cancelled: { next: null, label: "Cancelado", color: "bg-red-100 text-red-700", borderColor: "border-red-300", stripColor: "bg-red-300" },
} as const

const ACTION_BUTTONS = {
  paid: { label: "Preparar", icon: ChefHat, className: "bg-blue-600 hover:bg-blue-700 text-white" },
  preparing: { label: "Listo!", icon: Check, className: "bg-yellow-600 hover:bg-yellow-700 text-white" },
  ready: { label: "Entregado", icon: PackageCheck, className: "bg-green-600 hover:bg-green-700 text-white" },
} as const

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevCountRef = useRef<number>(0)

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/admin/orders")
    if (!res.ok) return
    const data = await res.json()
    if (Array.isArray(data)) {
      const activeCount = data.filter((o: OrderWithItems) => ["paid", "preparing", "ready"].includes(o.status)).length
      if (prevCountRef.current > 0 && activeCount > prevCountRef.current) {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {})
        }
        toast.info("Nuevo pedido recibido!")
      }
      prevCountRef.current = activeCount
      setOrders(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const updateStatus = async (orderNumber: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        toast.success(`Pedido actualizado a "${newStatus}"`)
        fetchOrders()
      }
    } catch {
      toast.error("Error al actualizar pedido")
    }
  }

  // Sort: paid first (most urgent), then preparing, then ready. Within each group, oldest first
  const statusPriority: Record<string, number> = { paid: 0, preparing: 1, ready: 2 }
  const activeOrders = orders
    .filter(o => ["paid", "preparing", "ready"].includes(o.status))
    .sort((a, b) => {
      const pDiff = (statusPriority[a.status] ?? 9) - (statusPriority[b.status] ?? 9)
      if (pDiff !== 0) return pDiff
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })
  const otherOrders = orders.filter(o => !["paid", "preparing", "ready"].includes(o.status))

  const isNewOrder = (order: OrderWithItems) =>
    order.status === "paid" && (Date.now() - new Date(order.created_at).getTime()) < 60000

  return (
    <div className="space-y-6">
      <audio ref={audioRef} src="/sounds/new-order.mp3" preload="auto" />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Cocina - Pedidos</h1>
        <Badge className="bg-olive text-white text-base px-3 py-1">
          {activeOrders.length} activos
        </Badge>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando pedidos...</p>
      ) : (
        <>
          {/* Active orders - Kitchen view */}
          {activeOrders.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <ChefHat className="h-5 w-5" /> Pedidos activos
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeOrders.map((order) => {
                  const statusInfo = STATUS_FLOW[order.status as keyof typeof STATUS_FLOW]
                  const actionBtn = ACTION_BUTTONS[order.status as keyof typeof ACTION_BUTTONS]
                  const sandwiches = order.order_items?.filter(i => i.item_type === "sandwich") || []
                  const drinks = order.order_items?.filter(i => i.item_type === "drink") || []

                  return (
                    <Card
                      key={order.id}
                      className={`overflow-hidden ${isNewOrder(order) ? "ring-2 ring-blue-500 animate-pulse" : ""} ${statusInfo?.borderColor ? `border-l-4 ${statusInfo.borderColor}` : ""}`}
                    >
                      <div className={`h-2 ${statusInfo?.stripColor}`} />
                      <CardContent className="p-4 space-y-3">
                        {/* Header: order number + status */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-2xl">{order.order_number}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo?.color}`}>
                            {statusInfo?.label}
                          </span>
                        </div>

                        {/* Customer name */}
                        <p className="text-sm font-medium text-muted-foreground">
                          {order.customer_name || "Cliente"}
                        </p>

                        {/* Time since order */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleString("es-AR", {
                            hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit",
                          })}
                        </div>

                        {/* Kitchen ticket: items to prepare */}
                        <div className="bg-cream rounded-lg p-3 space-y-2">
                          <div className="font-bold text-xs uppercase text-muted-foreground border-b pb-1 tracking-wider">
                            Preparar:
                          </div>

                          {sandwiches.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs font-bold uppercase text-olive tracking-wide">Sandwiches</div>
                              {sandwiches.map((item) => (
                                <div key={item.id} className="flex items-center gap-2 py-0.5">
                                  <span className="bg-olive text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">
                                    {item.quantity}
                                  </span>
                                  <span className="font-medium text-base">{item.item_name}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {drinks.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs font-bold uppercase text-blue-600 tracking-wide">Bebidas</div>
                              {drinks.map((item) => (
                                <div key={item.id} className="flex items-center gap-2 py-0.5">
                                  <span className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">
                                    {item.quantity}
                                  </span>
                                  <span className="font-medium text-base">{item.item_name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Customer notes */}
                        {order.notes && (
                          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-sm font-medium text-amber-800">{order.notes}</p>
                          </div>
                        )}

                        {/* Total + action button */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="font-bold text-olive text-lg">{formatPrice(Number(order.total))}</span>
                          {actionBtn && statusInfo?.next && (
                            <Button
                              size="lg"
                              className={`${actionBtn.className} gap-2 font-bold`}
                              onClick={() => updateStatus(order.order_number, statusInfo.next!)}
                            >
                              <actionBtn.icon className="h-5 w-5" />
                              {actionBtn.label}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* History */}
          {otherOrders.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-lg text-muted-foreground">Historial</h2>
              <div className="space-y-2">
                {otherOrders.slice(0, 20).map((order) => {
                  const statusInfo = STATUS_FLOW[order.status as keyof typeof STATUS_FLOW]
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between bg-white rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold">{order.order_number}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo?.color}`}>
                          {statusInfo?.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{order.customer_name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{formatPrice(Number(order.total))}</span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("es-AR")}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {orders.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No hay pedidos todavia
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
