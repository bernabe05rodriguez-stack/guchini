"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function FailureContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <XCircle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-3xl font-display font-bold mb-2">Pago no realizado</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        El pago no se pudo completar. Podés intentar de nuevo o elegir otro medio de pago.
      </p>
      {orderNumber && (
        <p className="text-sm text-muted-foreground mb-4">Pedido: {orderNumber}</p>
      )}
      <div className="flex gap-3">
        <Button asChild><Link href="/checkout">Reintentar</Link></Button>
        <Button variant="outline" asChild><Link href="/">Volver al inicio</Link></Button>
      </div>
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><p>Cargando...</p></div>}>
      <FailureContent />
    </Suspense>
  )
}
