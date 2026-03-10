"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

function PendingContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <Clock className="h-16 w-16 text-mustard mb-4" />
      <h1 className="text-3xl font-display font-bold mb-2">Pago pendiente</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Tu pago está siendo procesado. Te vamos a notificar cuando se confirme.
      </p>
      {orderNumber && (
        <p className="text-sm text-muted-foreground mb-4">Pedido: {orderNumber}</p>
      )}
      <Button asChild><Link href="/">Volver al inicio</Link></Button>
    </div>
  )
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><p>Cargando...</p></div>}>
      <PendingContent />
    </Suspense>
  )
}
