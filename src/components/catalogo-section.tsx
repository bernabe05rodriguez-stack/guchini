"use client"

import { CATALOG_PRODUCTS } from "@/lib/constants"
import { Sandwich } from "lucide-react"

export function CatalogoSection() {
  return (
    <section id="productos" className="py-20 bg-cream">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nuestros Sanguchinis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada sanguche es una obra maestra culinaria
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATALOG_PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
