"use client"

import Image from "next/image"
import { Plus, Sandwich, GlassWater } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import type { Sandwich as SandwichType, Drink } from "@/types/database"
import { toast } from "sonner"
import { CATALOG_PRODUCTS } from "@/lib/constants"

const FALLBACK_IMAGES: Record<string, string> = Object.fromEntries(
  CATALOG_PRODUCTS.map(p => [p.name.toLowerCase(), p.image])
)

interface ProductCardProps {
  product: SandwichType | Drink
  type: "sandwich" | "drink"
  compact?: boolean
}

function isSandwich(product: SandwichType | Drink): product is SandwichType {
  return "ingredients" in product
}

export function ProductCard({ product, type, compact = false }: ProductCardProps) {
  const { addItem } = useCart()
  const isDrink = type === "drink"

  const imageUrl = product.image_url || FALLBACK_IMAGES[product.name.toLowerCase()] || null

  const handleAdd = () => {
    if (!product.available) return
    addItem({
      id: product.id,
      type,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
    })
    toast.success(`${product.name} agregado al carrito`)
  }

  return (
    <Card className={`group overflow-hidden transition-all hover:shadow-md ${!product.available ? "opacity-60 grayscale" : ""}`}>
      {/* Image */}
      <div className={`relative ${isDrink ? "h-52 p-4" : "h-48"} bg-gradient-to-br ${isDrink ? "from-white to-cream" : "from-olive/10 to-brown/10"} overflow-hidden flex items-center justify-center`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`${isDrink ? "object-contain p-3" : "object-cover"} group-hover:scale-105 transition-transform duration-300`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isDrink ? (
              <GlassWater className="h-12 w-12 text-olive/30" />
            ) : (
              <Sandwich className="h-12 w-12 text-olive/30" />
            )}
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
              No disponible hoy
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Name */}
        <h3 className="font-display font-bold text-foreground text-lg text-center">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && !compact && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 text-center">
            {product.description}
          </p>
        )}

        {/* Ingredients */}
        {!compact && isSandwich(product) && product.ingredients && (
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {product.ingredients.map((ing, i) => (
              <Badge key={i} variant="accent" className="text-xs font-normal">
                {ing}
              </Badge>
            ))}
          </div>
        )}

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-olive">
            {formatPrice(Number(product.price))}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!product.available}
            className="bg-olive hover:bg-olive-light text-white gap-1"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
