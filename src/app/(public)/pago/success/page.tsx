"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get("order")
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!orderNumber) {
      router.push("/")
      return
    }

    const checkOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`)
        const data = await res.json()

        if (data.status === "paid" || data.status === "preparing" || data.status === "ready") {
          router.push(`/orden/${orderNumber}`)
          return
        }

        if (attempts < 7) {
          setTimeout(() => setAttempts(prev => prev + 1), 1500)
        } else {
          router.push(`/orden/${orderNumber}`)
        }
      } catch {
        if (attempts < 7) {
          setTimeout(() => setAttempts(prev => prev + 1), 1500)
        } else {
          router.push(`/orden/${orderNumber}`)
        }
      }
    }

    checkOrder()
  }, [orderNumber, attempts, router])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-olive mb-4" />
      <p className="text-lg font-display font-bold">Procesando tu pago...</p>
      <p className="text-muted-foreground text-sm mt-2">Te redirigimos en unos segundos</p>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-olive" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
