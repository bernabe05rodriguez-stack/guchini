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
    <section id="productos" className="py-14 md:py-24 bg-cream">
      <div className="container">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-mustard font-medium text-sm uppercase tracking-widest">Nuestra carta</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3 mb-3 md:mb-4">
            Nuestros Sanguchinis
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada sanguche es una obra maestra culinaria, hecho con ingredientes premium y pan focaccia artesanal
          </p>

          {/* Pedí y Retirá */}
          <div className="mt-8 md:mt-10 p-5 md:p-8 bg-white rounded-2xl shadow-sm border border-border mx-auto max-w-lg md:max-w-none md:inline-block">
            <h3 className="text-lg md:text-xl font-display font-bold text-olive mb-2 md:mb-3">
              Pedí y Retirá
            </h3>
            <p className="text-sm text-muted-foreground mb-4 md:mb-5">
              Ahorrá la fila y la espera. Elegí tu Guchini, pagá online y retiralo listo en el local.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-olive text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                <span className="font-medium text-foreground">Elegí tu sanguche</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-olive text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                <span className="font-medium text-foreground">Pagá online</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-olive text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                <span className="font-medium text-foreground">Retirá sin esperar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {CATALOG_PRODUCTS.map((product) => {
            const db = dbProducts.find(
              (p) => p.name.toLowerCase().includes(product.name.toLowerCase()) ||
                     product.name.toLowerCase().includes(p.name.toLowerCase())
            )

            return (
              <div
                key={product.name}
                className={`group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 ${
                  db && !db.available ? "opacity-60 grayscale" : ""
                }`}
              >
                <div className="relative h-36 sm:h-48 md:h-60 overflow-hidden">
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
                    <Sandwich className="h-12 w-12 md:h-16 md:w-16 text-olive/20" />
                  </div>
                  {db && !db.available && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold text-xs md:text-sm bg-black/60 px-3 py-1 rounded-full">
                        No disponible
                      </span>
                    </div>
                  )}
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3">
                      <span className="text-[10px] md:text-xs font-medium text-white bg-green-600/90 backdrop-blur-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4 md:p-5">
                  <h3 className="text-sm sm:text-base md:text-xl font-display font-bold text-foreground mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-2 md:mb-4 line-clamp-2 md:line-clamp-none min-h-0 md:min-h-[3rem]">
                    {product.description}
                  </p>

                  {/* Precio y botón */}
                  {db && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 md:pt-4 border-t border-border">
                      <span className="text-lg md:text-2xl font-bold text-olive">
                        {formatPrice(db.price)}
                      </span>
                      <Button
                        onClick={() => handleAdd(product, db)}
                        disabled={!db.available}
                        size="sm"
                        className={`gap-1 md:gap-1.5 rounded-full px-3 md:px-5 text-xs md:text-sm w-full sm:w-auto ${!storeOpen ? "bg-gray-400 hover:bg-gray-500" : "bg-olive hover:bg-olive-light"} text-white`}
                      >
                        <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
