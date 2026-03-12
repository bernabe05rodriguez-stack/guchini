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
  storeOpen?: boolean
  storeMessage?: string
}

function isSandwich(product: SandwichType | Drink): product is SandwichType {
  return "ingredients" in product
}

export function ProductCard({ product, type, compact = false, storeOpen = true, storeMessage = "" }: ProductCardProps) {
  const { addItem } = useCart()
  const isDrink = type === "drink"

  const imageUrl = product.image_url || FALLBACK_IMAGES[product.name.toLowerCase()] || null

  const handleAdd = () => {
    if (!product.available) return
    if (!storeOpen) {
      toast.error(`Local cerrado. ${storeMessage}`)
      return
    }
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
      <div className={`relative ${isDrink ? "h-36 sm:h-44 md:h-52 p-3 md:p-4" : "h-36 sm:h-44 md:h-48"} ${isDrink ? "bg-white" : "bg-gradient-to-br from-olive/10 to-brown/10"} overflow-hidden flex items-center justify-center`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
            className={`${isDrink ? "object-contain p-2 md:p-3" : "object-cover"} group-hover:scale-105 transition-transform duration-300`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isDrink ? (
              <GlassWater className="h-10 w-10 md:h-12 md:w-12 text-olive/30" />
            ) : (
              <Sandwich className="h-10 w-10 md:h-12 md:w-12 text-olive/30" />
            )}
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-xs md:text-sm bg-black/60 px-3 py-1 rounded-full">
              No disponible
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-3 md:p-4">
        {/* Name */}
        <h3 className="font-display font-bold text-foreground text-sm md:text-lg text-center">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && !compact && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 text-center">
            {product.description}
          </p>
        )}

        {/* Ingredients */}
        {!compact && isSandwich(product) && product.ingredients && (
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {product.ingredients.map((ing, i) => (
              <Badge key={i} variant="accent" className="text-[10px] md:text-xs font-normal">
                {ing}
              </Badge>
            ))}
          </div>
        )}

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-2 md:mt-3">
          <span className="text-base md:text-lg font-bold text-olive">
            {formatPrice(Number(product.price))}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!product.available}
            className={`gap-1 text-xs md:text-sm px-2.5 md:px-3 ${!storeOpen ? "bg-gray-400 hover:bg-gray-500" : "bg-olive hover:bg-olive-light"} text-white`}
          >
            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">{storeOpen ? "Agregar" : "Cerrado"}</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
