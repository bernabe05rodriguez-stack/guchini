export const dynamic = "force-dynamic"

import { prisma } from "@/lib/db"
import { HeroSection } from "@/components/hero-section"
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

      {/* Nuestros Sanguchinis - con fotos, precios y compra */}
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

          <ProductGrid products={sandwichData} type="sandwich" />
        </div>
      </section>

      {/* Para acompañar */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            Para acompañar
          </h2>
          <ProductGrid products={drinkData} type="drink" compact />
        </div>
      </section>

      <FranquiciasSection />
      <HistoriaSection />
      <LocalesSection />
    </>
  )
}
