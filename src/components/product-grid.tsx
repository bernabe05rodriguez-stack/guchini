"use client"

import { ProductCard } from "@/components/product-card"
import type { Sandwich, Drink } from "@/types/database"

interface ProductGridProps {
  products: (Sandwich | Drink)[]
  type: "sandwich" | "drink"
  compact?: boolean
}

export function ProductGrid({ products, type, compact = false }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No hay productos disponibles en este momento
      </p>
    )
  }

  return (
    <div className={`grid gap-4 ${
      compact
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    }`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          type={type}
          compact={compact}
        />
      ))}
    </div>
  )
}
