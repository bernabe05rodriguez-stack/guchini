"use client"

import { useEffect, useState } from "react"
import { DollarSign, ShoppingBag, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  totalCustomers: number
  recentOrders: Array<{
    id: string
    order_number: string
    status: string
    total: number
    created_at: string
  }>
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statCards = [
    {
      title: "Pedidos hoy",
      value: stats?.todayOrders || 0,
      icon: ShoppingBag,
      color: "text-olive",
    },
    {
      title: "Ingresos hoy",
      value: formatPrice(stats?.todayRevenue || 0),
      icon: DollarSign,
      color: "text-mustard",
    },
    {
      title: "Pendientes",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "text-brown",
    },
    {
      title: "Clientes totales",
      value: stats?.totalCustomers || 0,
      icon: TrendingUp,
      color: "text-olive",
    },
  ]

  const statusLabels: Record<string, string> = {
    pending: "Pendiente",
    paid: "Pagado",
    preparing: "Preparando",
    ready: "Listo",
    delivered: "Entregado",
    cancelled: "Cancelado",
  }

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    paid: "bg-blue-100 text-blue-700",
    preparing: "bg-yellow-100 text-yellow-700",
    ready: "bg-green-100 text-green-700",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-100 text-red-700",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`p-3 rounded-xl bg-cream ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">
                  {loading ? "..." : stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <span className="font-mono font-bold">{order.order_number}</span>
                    <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || ""}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{formatPrice(Number(order.total))}</span>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No hay pedidos hoy</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
