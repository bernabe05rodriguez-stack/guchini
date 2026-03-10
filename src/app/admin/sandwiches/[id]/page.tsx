"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminSandwichFormPage() {
  const params = useParams()
  const router = useRouter()
  const isNew = params.id === "new"

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [ingredientInput, setIngredientInput] = useState("")
  const [price, setPrice] = useState("")
  const [available, setAvailable] = useState(true)
  const [displayOrder, setDisplayOrder] = useState("0")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!isNew)

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/sandwiches/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name || "")
          setDescription(data.description || "")
          setIngredients(data.ingredients || [])
          setPrice(String(data.price || ""))
          setAvailable(data.available ?? true)
          setDisplayOrder(String(data.display_order || 0))
          setImageUrl(data.image_url || "")
          setFetching(false)
        })
        .catch(() => {
          toast.error("Error al cargar sándwich")
          setFetching(false)
        })
    }
  }, [isNew, params.id])

  const addIngredient = () => {
    const trimmed = ingredientInput.trim()
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients(prev => [...prev, trimmed])
      setIngredientInput("")
    }
  }

  const removeIngredient = (ing: string) => {
    setIngredients(prev => prev.filter(i => i !== ing))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let uploadedImageUrl = imageUrl

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)
        formData.append("folder", "sandwiches")
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          uploadedImageUrl = url
        }
      }

      const body = {
        name,
        description,
        ingredients,
        price: parseFloat(price),
        available,
        display_order: parseInt(displayOrder),
        image_url: uploadedImageUrl || null,
      }

      const url = isNew ? "/api/admin/sandwiches" : `/api/admin/sandwiches/${params.id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(isNew ? "Sándwich creado" : "Sándwich actualizado")
        router.push("/admin/sandwiches")
      } else {
        toast.error("Error al guardar")
      }
    } catch {
      toast.error("Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <p className="text-muted-foreground">Cargando...</p>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/sandwiches">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-display font-bold">
          {isNew ? "Nuevo Sándwich" : "Editar Sándwich"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: El Crudo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Una breve descripción..."
              />
            </div>

            <div className="space-y-2">
              <Label>Ingredientes</Label>
              <div className="flex gap-2">
                <Input
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Agregar ingrediente..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addIngredient()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addIngredient}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {ingredients.map((ing) => (
                  <Badge key={ing} variant="accent" className="gap-1 pr-1">
                    {ing}
                    <button
                      type="button"
                      onClick={() => removeIngredient(ing)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3500"
                  min="0"
                  step="50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Orden de display</Label>
                <Input
                  id="order"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Foto del producto</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageUrl && !imageFile && (
                <p className="text-xs text-muted-foreground">Imagen actual guardada</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="available"
                checked={available}
                onCheckedChange={setAvailable}
              />
              <Label htmlFor="available">Disponible</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                isNew ? "Crear Sándwich" : "Guardar cambios"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
