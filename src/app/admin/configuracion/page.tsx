"use client"

import { useEffect, useState } from "react"
import { Settings, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function AdminConfiguracionPage() {
  const [baseWait, setBaseWait] = useState("7")
  const [waitPerOrder, setWaitPerOrder] = useState("2")
  const [storeOpen, setStoreOpen] = useState(true)
  const [storeMessage, setStoreMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then((data: Array<{ key: string; value: string }>) => {
        data.forEach(s => {
          switch (s.key) {
            case "base_wait_minutes": setBaseWait(s.value); break
            case "wait_per_order": setWaitPerOrder(s.value); break
            case "store_open": setStoreOpen(s.value === "true"); break
            case "store_message": setStoreMessage(s.value); break
          }
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { key: "base_wait_minutes", value: baseWait },
          { key: "wait_per_order", value: waitPerOrder },
          { key: "store_open", value: String(storeOpen) },
          { key: "store_message", value: storeMessage },
        ]),
      })

      if (res.ok) {
        toast.success("Configuración guardada")
      } else {
        toast.error("Error al guardar")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted-foreground">Cargando...</p>

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-display font-bold flex items-center gap-2">
        <Settings className="h-8 w-8" />
        Configuración
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Estado del local</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Local abierto</Label>
              <p className="text-sm text-muted-foreground">
                Si está cerrado, no se pueden hacer pedidos
              </p>
            </div>
            <Switch checked={storeOpen} onCheckedChange={setStoreOpen} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje visible en la tienda</Label>
            <Textarea
              id="message"
              value={storeMessage}
              onChange={(e) => setStoreMessage(e.target.value)}
              placeholder="Ej: ¡Pedí y retirá en San Lorenzo 577!"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tiempos de espera</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseWait">Tiempo base (minutos)</Label>
              <Input
                id="baseWait"
                type="number"
                value={baseWait}
                onChange={(e) => setBaseWait(e.target.value)}
                min="1"
              />
              <p className="text-xs text-muted-foreground">
                Tiempo mínimo de espera
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitPerOrder">Min. por pedido en cola</Label>
              <Input
                id="waitPerOrder"
                type="number"
                value={waitPerOrder}
                onChange={(e) => setWaitPerOrder(e.target.value)}
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Se suma por cada pedido activo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Guardando...
          </>
        ) : (
          "Guardar configuración"
        )}
      </Button>
    </div>
  )
}
