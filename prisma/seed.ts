import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Sándwiches
  await prisma.sandwich.createMany({
    data: [
      {
        name: "El Crudo",
        description: "El clásico italiano, pero con onda mendocina",
        ingredients: ["Jamón crudo", "Queso sardo", "Tomate", "Rúcula", "Pesto de albahaca"],
        price: 3500,
        available: true,
        displayOrder: 1,
      },
      {
        name: "La Mortadela",
        description: "La reina de la charcutería, versión premium",
        ingredients: ["Mortadela con pistacho", "Stracciatella", "Queso sbrinz", "Pesto de albahaca"],
        price: 3800,
        available: true,
        displayOrder: 2,
      },
      {
        name: "La Patrona",
        description: "Para los que mandan en la mesa, sin carne pero con carácter",
        ingredients: ["Milanesa de berenjena", "Queso sardo", "Cebolla pickle", "Tomate", "Rúcula", "Alioli alimonado"],
        price: 3200,
        available: true,
        displayOrder: 3,
      },
    ],
    skipDuplicates: true,
  })

  // Bebidas
  await prisma.drink.createMany({
    data: [
      { name: "Gaseosa", description: "Coca-Cola, Sprite o Fanta", price: 800, available: true, displayOrder: 1 },
      { name: "Agua", description: "Mineral con o sin gas", price: 600, available: true, displayOrder: 2 },
      { name: "Limonada artesanal", description: "Hecha en el momento con limones frescos", price: 1200, available: true, displayOrder: 3 },
      { name: "Cerveza", description: "Artesanal de la casa", price: 1500, available: true, displayOrder: 4 },
      { name: "Vermut", description: "El aperitivo mendocino por excelencia", price: 1400, available: true, displayOrder: 5 },
    ],
    skipDuplicates: true,
  })

  // Settings
  await prisma.setting.createMany({
    data: [
      { key: "base_wait_minutes", value: "7", description: "Tiempo base de espera en minutos" },
      { key: "wait_per_order", value: "2", description: "Minutos adicionales por pedido en cola" },
      { key: "store_open", value: "true", description: "Si el local está abierto para recibir pedidos" },
      { key: "store_message", value: "¡Pedí y retirá en San Lorenzo 577!", description: "Mensaje visible en la tienda" },
    ],
    skipDuplicates: true,
  })

  // Admin user (password: 12345678)
  const hash = await bcrypt.hash("12345678", 10)
  await prisma.adminUser.upsert({
    where: { username: "guchini-admin" },
    update: {},
    create: {
      username: "guchini-admin",
      passwordHash: hash,
    },
  })

  console.log("Seed completado")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
