"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, ShoppingBag, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { items, total } = useCart()
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [estimatedWait, setEstimatedWait] = useState<number | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      router.push("/")
      return
    }

    // Fetch estimated wait time
    fetch("/api/orders/wait-time")
      .then(res => res.json())
      .then(data => setEstimatedWait(data.minutes))
      .catch(() => setEstimatedWait(12))
  }, [items.length, router])

  const handlePay = async () => {
    setLoading(true)
    try {
      // 1. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            item_type: item.type,
            item_id: item.id,
            item_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
          })),
          notes,
          estimated_wait_minutes: estimatedWait,
        }),
      })

      if (!orderRes.ok) {
        throw new Error("Error al crear el pedido")
      }

      const order = await orderRes.json()

      // 2. Create MercadoPago preference
      const mpRes = await fetch("/api/mercadopago/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
        }),
      })

      if (!mpRes.ok) {
        throw new Error("Error al conectar con MercadoPago")
      }

      const { init_point } = await mpRes.json()

      // 3. Redirect to MercadoPago
      window.location.href = init_point
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error inesperado")
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <h1 className="text-3xl font-display font-bold">Confirmar pedido</h1>

      {/* Order summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Resumen del pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground ml-2">x{item.quantity}</span>
              </div>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-olive">{formatPrice(total)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Estimated wait */}
      {estimatedWait !== null && (
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Clock className="h-5 w-5 text-olive" />
            <div>
              <p className="font-medium">Tiempo estimado de espera</p>
              <p className="text-2xl font-bold text-olive">~{estimatedWait} minutos</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardContent className="py-4 space-y-2">
          <Label htmlFor="notes">¿Alguna aclaración?</Label>
          <Textarea
            id="notes"
            placeholder="Ej: Sin cebolla, extra salsa..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
          />
        </CardContent>
      </Card>

      {/* Pay button */}
      <Button
        size="lg"
        className="w-full bg-mustard hover:bg-mustard-dark text-foreground font-bold text-lg h-14 gap-2"
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? (
          <span className="animate-pulse">Procesando...</span>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pagar con MercadoPago — {formatPrice(total)}
          </>
        )}
      </Button>
    </div>
  )
}
