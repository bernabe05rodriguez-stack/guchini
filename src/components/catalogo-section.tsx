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
  storeOpen: boolean
  storeMessage: string
}

export function CatalogoSection({ dbProducts, storeOpen, storeMessage }: CatalogoSectionProps) {
  const { addItem } = useCart()

  const handleAdd = (product: typeof CATALOG_PRODUCTS[0], db: DbProduct) => {
    if (!db.available) return
    if (!storeOpen) {
      toast.error(`Local cerrado. ${storeMessage}`)
      return
    }
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
    <section id="productos" className="py-24 bg-cream">
      <div className="container">
        <div className="text-center mb-16">
          <span className="text-mustard font-medium text-sm uppercase tracking-widest">Nuestra carta</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-3 mb-4">
            Nuestros Sanguchinis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada sanguche es una obra maestra culinaria, hecho con ingredientes premium y pan focaccia artesanal
          </p>

          {/* Pedí y Retirá */}
          <div className="mt-10 p-8 bg-white rounded-2xl shadow-sm inline-block border border-border">
            <h3 className="text-xl font-display font-bold text-olive mb-3">
              Pedí y Retirá
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Ahorrá la fila y la espera. Elegí tu Guchini, pagá online y retiralo listo en el local.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-olive text-white flex items-center justify-center font-bold text-sm">1</span>
                <span className="font-medium text-foreground">Elegí tu sanguche</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-olive text-white flex items-center justify-center font-bold text-sm">2</span>
                <span className="font-medium text-foreground">Pagá online</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-olive text-white flex items-center justify-center font-bold text-sm">3</span>
                <span className="font-medium text-foreground">Retirá sin esperar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATALOG_PRODUCTS.map((product) => {
            const db = dbProducts.find(
              (p) => p.name.toLowerCase().includes(product.name.toLowerCase()) ||
                     product.name.toLowerCase().includes(p.name.toLowerCase())
            )

            return (
              <div
                key={product.name}
                className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 ${
                  db && !db.available ? "opacity-60 grayscale" : ""
                }`}
              >
                <div className="relative h-60 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-olive/10 to-brown/10 ${product.image ? "hidden" : ""}`}>
                    <Sandwich className="h-16 w-16 text-olive/20" />
                  </div>
                  {db && !db.available && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm bg-black/60 px-4 py-1.5 rounded-full">
                        No disponible hoy
                      </span>
                    </div>
                  )}
                  {/* Bread badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-medium text-white bg-olive/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      Pan {product.bread}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-display font-bold text-foreground mb-1.5">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[3rem]">
                    {product.description}
                  </p>

                  {/* Precio y botón */}
                  {db && (
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-2xl font-bold text-olive">
                        {formatPrice(db.price)}
                      </span>
                      <Button
                        onClick={() => handleAdd(product, db)}
                        disabled={!db.available}
                        size="sm"
                        className={`gap-1.5 rounded-full px-5 ${!storeOpen ? "bg-gray-400 hover:bg-gray-500" : "bg-olive hover:bg-olive-light"} text-white`}
                      >
                        <Plus className="h-4 w-4" />
                        {storeOpen ? "Agregar" : "Cerrado"}
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
