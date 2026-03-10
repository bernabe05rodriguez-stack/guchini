"use client"

import { CATALOG_PRODUCTS } from "@/lib/constants"
import { Sandwich, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

interface DbProduct {
  id: string
  name: string
  price: number
  available: boolean
  image_url: string | null
}

interface CatalogoSectionProps {
  dbProducts: DbProduct[]
}

export function CatalogoSection({ dbProducts }: CatalogoSectionProps) {
  const { addItem } = useCart()

  const handleAdd = (product: typeof CATALOG_PRODUCTS[0], db: DbProduct) => {
    if (!db.available) return
    addItem({
      id: db.id,
      type: "sandwich",
      name: db.name,
      price: db.price,
      image_url: product.image,
    })
    toast.success(`${db.name} agregado al carrito`)
  }

  return (
    <section id="productos" className="py-20 bg-cream">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nuestros Sanguchinis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada sanguche es una obra maestra culinaria
          </p>

          {/* Pedí y Retirá */}
          <div className="mt-8 p-6 bg-olive/5 rounded-2xl inline-block">
            <h3 className="text-xl font-display font-bold text-olive mb-2">
              Pedí y Retirá
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ahorrá la fila y la espera. Elegí tu Guchini, pagá online y retiralo listo en el local.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center text-olive font-bold">1</span>
                Elegí tu sanguche
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center text-olive font-bold">2</span>
                Pagá online
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center text-olive font-bold">3</span>
                Retirá sin esperar
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATALOG_PRODUCTS.map((product) => {
            const db = dbProducts.find(
              (p) => p.name.toLowerCase().includes(product.name.toLowerCase()) ||
                     product.name.toLowerCase().includes(p.name.toLowerCase())
            )

            return (
              <div
                key={product.name}
                className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  db && !db.available ? "opacity-60 grayscale" : ""
                }`}
              >
                <div className="relative h-56 bg-gradient-to-br from-olive/10 to-brown/10 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${product.image ? "hidden" : ""}`}>
                    <Sandwich className="h-16 w-16 text-olive/20" />
                  </div>
                  {db && !db.available && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
                        No disponible hoy
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {product.description}
                  </p>
                  <span className="inline-block text-xs font-medium text-olive bg-olive/10 px-3 py-1 rounded-full">
                    Pan {product.bread}
                  </span>

                  {/* Precio y botón */}
                  {db && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="text-xl font-bold text-olive">
                        {formatPrice(db.price)}
                      </span>
                      <Button
                        onClick={() => handleAdd(product, db)}
                        disabled={!db.available}
                        className="bg-olive hover:bg-olive-light text-white gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
