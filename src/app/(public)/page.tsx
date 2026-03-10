export const dynamic = "force-dynamic"

import { prisma } from "@/lib/db"
import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"

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

      <div className="container py-10 space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            Nuestros Sándwiches
          </h2>
          <ProductGrid products={sandwichData} type="sandwich" />
        </section>

        <section>
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            Para acompañar
          </h2>
          <ProductGrid products={drinkData} type="drink" compact />
        </section>
      </div>
    </>
  )
}
