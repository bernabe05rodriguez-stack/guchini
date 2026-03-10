"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import type { OrderWithItems } from "@/types/database"

const STATUS_FLOW = {
  paid: { next: "preparing", label: "Preparar", color: "bg-blue-100 text-blue-700" },
  preparing: { next: "ready", label: "Listo", color: "bg-yellow-100 text-yellow-700" },
  ready: { next: "delivered", label: "Entregado", color: "bg-green-100 text-green-700" },
  delivered: { next: null, label: "Entregado", color: "bg-green-50 text-green-600" },
  pending: { next: null, label: "Pendiente", color: "bg-gray-100 text-gray-700" },
  cancelled: { next: null, label: "Cancelado", color: "bg-red-100 text-red-700" },
} as const

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevCountRef = useRef<number>(0)

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/admin/orders")
    const data = await res.json()
    const activeCount = data.filter((o: OrderWithItems) => ["paid", "preparing", "ready"].includes(o.status)).length
    if (prevCountRef.current > 0 && activeCount > prevCountRef.current) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
      }
      toast.info("Nuevo pedido recibido!")
    }
    prevCountRef.current = activeCount
    setOrders(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()
    // Poll every 10 seconds instead of Supabase Realtime
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

  const activeOrders = orders.filter(o => ["paid", "preparing", "ready"].includes(o.status))
  const otherOrders = orders.filter(o => !["paid", "preparing", "ready"].includes(o.status))

  return (
    <div className="space-y-6">
      <audio ref={audioRef} src="/sounds/new-order.mp3" preload="auto" />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Pedidos</h1>
        <Badge className="bg-olive text-white">
          {activeOrders.length} activos
        </Badge>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando pedidos...</p>
      ) : (
        <>
          {/* Active orders */}
          {activeOrders.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-display font-bold text-lg">Pedidos activos</h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {activeOrders.map((order) => {
                  const statusInfo = STATUS_FLOW[order.status as keyof typeof STATUS_FLOW]
                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <div className={`h-1 ${order.status === "paid" ? "bg-blue-500" : order.status === "preparing" ? "bg-yellow-500" : "bg-green-500"}`} />
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-lg">{order.order_number}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusInfo?.color}`}>
                            {statusInfo?.label}
                          </span>
                        </div>

                        {/* Items */}
                        <div className="text-sm space-y-1">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between">
                              <span>x{item.quantity} {item.item_name}</span>
                              <span className="text-muted-foreground">{formatPrice(Number(item.subtotal))}</span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <p className="text-xs bg-mustard/10 text-brown rounded-lg p-2">
                            {order.notes}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="font-bold text-olive">{formatPrice(Number(order.total))}</span>
                          <div className="flex gap-2">
                            {statusInfo?.next && (
                              <Button
                                size="sm"
                                className="bg-olive hover:bg-olive-light"
                                onClick={() => updateStatus(order.order_number, statusInfo.next!)}
                              >
                                {STATUS_FLOW[statusInfo.next as keyof typeof STATUS_FLOW]?.label || statusInfo.next}
                              </Button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleString("es-AR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Other orders */}
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
                No hay pedidos todavía
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
