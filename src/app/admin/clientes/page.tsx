"use client"

import { useEffect, useState } from "react"
import { Search, Download, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatPrice } from "@/lib/utils"
import type { User } from "@/types/database"

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/customers")
      .then(res => res.json())
      .then(data => {
        setCustomers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const exportCSV = () => {
    const header = "Nombre,Email,Teléfono,Pedidos,Total Gastado,Registrado\n"
    const rows = filtered.map(c =>
      `"${c.full_name || ""}","${c.email}","${c.phone || ""}",${c.total_orders},${c.total_spent},"${new Date(c.created_at).toLocaleDateString("es-AR")}"`
    ).join("\n")

    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "clientes-guchini.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">👥 Clientes</h1>
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            {search ? "No se encontraron clientes" : "No hay clientes registrados"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <Avatar>
                  <AvatarImage src={customer.avatar_url || ""} />
                  <AvatarFallback className="bg-olive text-white">
                    {customer.full_name?.[0] || customer.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{customer.full_name || "Sin nombre"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                </div>

                <div className="text-right text-sm">
                  <p><span className="font-bold">{customer.total_orders}</span> pedidos</p>
                  <p className="text-olive font-medium">{formatPrice(Number(customer.total_spent))}</p>
                </div>

                <div className="text-xs text-muted-foreground text-right">
                  {new Date(customer.created_at).toLocaleDateString("es-AR")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
