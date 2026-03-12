export const dynamic = "force-dynamic"

import { prisma } from "@/lib/db"
import { HeroSection } from "@/components/hero-section"
import { CatalogoSection } from "@/components/catalogo-section"
import { ProductGrid } from "@/components/product-grid"
import { FranquiciasSection } from "@/components/franquicias-section"
import { HistoriaSection } from "@/components/historia-section"
import { getStoreStatus } from "@/lib/constants"

export default async function HomePage() {
  const [sandwiches, drinks] = await Promise.all([
    prisma.sandwich.findMany({ where: { available: true }, orderBy: { displayOrder: "asc" } }),
    prisma.drink.findMany({ where: { available: true }, orderBy: { displayOrder: "asc" } }),
  ])

  const { isOpen: storeOpen, message: storeMessage } = getStoreStatus()

  const sandwichData = sandwiches.map(s => ({
    id: s.id,
    name: s.name,
    price: Number(s.price),
    image_url: s.imageUrl,
    available: s.available,
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

      {/* Nuestros Sanguchinis */}
      <CatalogoSection dbProducts={sandwichData} storeOpen={storeOpen} storeMessage={storeMessage} />

      {/* Bebidas */}
      <section className="py-14 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-8 md:mb-14">
            <span className="text-mustard font-medium text-sm uppercase tracking-widest">Complementos</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3 mb-3 md:mb-4">
              Para Acompañar
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Completá tu combo con la bebida perfecta
            </p>
          </div>
          <ProductGrid products={drinkData} type="drink" storeOpen={storeOpen} storeMessage={storeMessage} />
        </div>
      </section>

      <FranquiciasSection />
      <HistoriaSection />
    </>
  )
}
