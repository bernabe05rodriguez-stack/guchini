"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2, Sandwich } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import type { Sandwich as SandwichType } from "@/types/database"

export default function AdminSandwichesPage() {
  const [sandwiches, setSandwiches] = useState<SandwichType[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSandwiches = async () => {
    const res = await fetch("/api/admin/sandwiches")
    const data = await res.json()
    setSandwiches(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchSandwiches()
  }, [])

  const toggleAvailable = async (id: string, available: boolean) => {
    const res = await fetch(`/api/admin/sandwiches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available }),
    })
    if (res.ok) {
      setSandwiches(prev =>
        prev.map(s => (s.id === id ? { ...s, available } : s))
      )
      toast.success(available ? "Sándwich habilitado" : "Sándwich deshabilitado")
    }
  }

  const deleteSandwich = async (id: string) => {
    if (!confirm("¿Eliminar este sándwich?")) return
    const res = await fetch(`/api/admin/sandwiches/${id}`, { method: "DELETE" })
    if (res.ok) {
      setSandwiches(prev => prev.filter(s => s.id !== id))
      toast.success("Sándwich eliminado")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">🥪 Sándwiches</h1>
        <Button asChild className="gap-2">
          <Link href="/admin/sandwiches/new">
            <Plus className="h-4 w-4" />
            Nuevo Sándwich
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : sandwiches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay sándwiches todavía
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sandwiches.map((sandwich) => (
            <Card key={sandwich.id}>
              <CardContent className="flex items-center gap-4 py-4">
                {/* Image */}
                <div className="h-16 w-16 rounded-xl bg-cream overflow-hidden flex-shrink-0">
                  {sandwich.image_url ? (
                    <Image
                      src={sandwich.image_url}
                      alt={sandwich.name}
                      width={64}
                      height={64}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Sandwich className="h-6 w-6 text-olive/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold">{sandwich.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {sandwich.ingredients?.join(", ")}
                  </p>
                  <p className="text-sm font-bold text-olive">
                    {formatPrice(Number(sandwich.price))}
                  </p>
                </div>

                {/* Available toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {sandwich.available ? "Disponible" : "No disponible"}
                  </span>
                  <Switch
                    checked={sandwich.available}
                    onCheckedChange={(checked) => toggleAvailable(sandwich.id, checked)}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/sandwiches/${sandwich.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deleteSandwich(sandwich.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
