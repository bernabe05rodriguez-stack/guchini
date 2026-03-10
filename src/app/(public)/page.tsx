export const dynamic = "force-dynamic"

import { prisma } from "@/lib/db"
import { HeroSection } from "@/components/hero-section"
import { CatalogoSection } from "@/components/catalogo-section"
import { ProductGrid } from "@/components/product-grid"
import { FranquiciasSection } from "@/components/franquicias-section"
import { HistoriaSection } from "@/components/historia-section"
import { LocalesSection } from "@/components/locales-section"

export default async function HomePage() {
  const [sandwiches, drinks, settings] = await Promise.all([
    prisma.sandwich.findMany({ where: { available: true }, orderBy: { displayOrder: "asc" } }),
    prisma.drink.findMany({ where: { available: true }, orderBy: { displayOrder: "asc" } }),
    prisma.setting.findMany({ where: { key: { in: ["store_open", "store_message"] } } }),
  ])

  const storeOpen = settings.find(s => s.key === "store_open")?.value === "true"
  const storeMessage = settings.find(s => s.key === "store_message")?.value || ""

  const sandwichData = sandwiches.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    ingredients: s.ingredients as string[],
    price: Number(s.price),
    image_url: s.imageUrl,
    available: s.available,
    display_order: s.displayOrder,
  }))

  const drinkData = drinks.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description,
    price: Number(d.price),
    image_url: d.imageUrl,
    available: d.available,
    display_order: d.displayOrder,
  }))

  return (
    <>
      <HeroSection storeOpen={storeOpen} storeMessage={storeMessage} />

      {/* Catálogo showcase (estático, como en guchini.com.ar) */}
      <CatalogoSection />

      {/* Pedidos online - productos del sistema */}
      <section id="pedir" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Pedí Online
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Elegí tu sanguche, pagá online y pasá a buscar. Nada más simple.
            </p>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-6">
                Sándwiches
              </h3>
              <ProductGrid products={sandwichData} type="sandwich" />
            </div>

            <div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-6">
                Para acompañar
              </h3>
              <ProductGrid products={drinkData} type="drink" compact />
            </div>
          </div>
        </div>
      </section>

      <FranquiciasSection />
      <HistoriaSection />
      <LocalesSection />
    </>
  )
}
