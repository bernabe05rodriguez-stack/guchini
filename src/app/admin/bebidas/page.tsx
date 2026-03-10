"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2, GlassWater } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import type { Drink } from "@/types/database"

export default function AdminBebidasPage() {
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDrinks = async () => {
    const res = await fetch("/api/admin/drinks")
    const data = await res.json()
    setDrinks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchDrinks()
  }, [])

  const toggleAvailable = async (id: string, available: boolean) => {
    const res = await fetch(`/api/admin/drinks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available }),
    })
    if (res.ok) {
      setDrinks(prev => prev.map(d => (d.id === id ? { ...d, available } : d)))
      toast.success(available ? "Bebida habilitada" : "Bebida deshabilitada")
    }
  }

  const deleteDrink = async (id: string) => {
    if (!confirm("¿Eliminar esta bebida?")) return
    const res = await fetch(`/api/admin/drinks/${id}`, { method: "DELETE" })
    if (res.ok) {
      setDrinks(prev => prev.filter(d => d.id !== id))
      toast.success("Bebida eliminada")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">🥤 Bebidas</h1>
        <Button asChild className="gap-2">
          <Link href="/admin/bebidas/new">
            <Plus className="h-4 w-4" />
            Nueva Bebida
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : drinks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay bebidas todavía
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {drinks.map((drink) => (
            <Card key={drink.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="h-12 w-12 rounded-xl bg-cream overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {drink.image_url ? (
                    <Image src={drink.image_url} alt={drink.name} width={48} height={48} className="object-cover h-full w-full" />
                  ) : (
                    <GlassWater className="h-5 w-5 text-olive/30" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold">{drink.name}</h3>
                  {drink.description && (
                    <p className="text-sm text-muted-foreground truncate">{drink.description}</p>
                  )}
                  <p className="text-sm font-bold text-olive">{formatPrice(Number(drink.price))}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {drink.available ? "Disponible" : "No disponible"}
                  </span>
                  <Switch
                    checked={drink.available}
                    onCheckedChange={(checked) => toggleAvailable(drink.id, checked)}
                  />
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/bebidas/${drink.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteDrink(drink.id)}>
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
