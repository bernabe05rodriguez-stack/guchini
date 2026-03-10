"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminDrinkFormPage() {
  const params = useParams()
  const router = useRouter()
  const isNew = params.id === "new"

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [available, setAvailable] = useState(true)
  const [displayOrder, setDisplayOrder] = useState("0")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!isNew)

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/drinks/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name || "")
          setDescription(data.description || "")
          setPrice(String(data.price || ""))
          setAvailable(data.available ?? true)
          setDisplayOrder(String(data.display_order || 0))
          setImageUrl(data.image_url || "")
          setFetching(false)
        })
        .catch(() => {
          toast.error("Error al cargar bebida")
          setFetching(false)
        })
    }
  }, [isNew, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let uploadedImageUrl = imageUrl

      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)
        formData.append("folder", "drinks")
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          uploadedImageUrl = url
        }
      }

      const body = {
        name,
        description,
        price: parseFloat(price),
        available,
        display_order: parseInt(displayOrder),
        image_url: uploadedImageUrl || null,
      }

      const url = isNew ? "/api/admin/drinks" : `/api/admin/drinks/${params.id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(isNew ? "Bebida creada" : "Bebida actualizada")
        router.push("/admin/bebidas")
      } else {
        toast.error("Error al guardar")
      }
    } catch {
      toast.error("Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <p className="text-muted-foreground">Cargando...</p>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/bebidas"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-display font-bold">
          {isNew ? "Nueva Bebida" : "Editar Bebida"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($) *</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Orden</Label>
                <Input id="order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} min="0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Foto</Label>
              <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>

            <div className="flex items-center gap-3">
              <Switch id="available" checked={available} onCheckedChange={setAvailable} />
              <Label htmlFor="available">Disponible</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Guardando...</> : (isNew ? "Crear Bebida" : "Guardar cambios")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
