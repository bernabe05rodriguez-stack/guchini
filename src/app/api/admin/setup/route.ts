export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminFromCookie } from "@/lib/auth"

export async function POST() {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    // Create all tables via raw SQL
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password_hash" TEXT NOT NULL,
        "full_name" TEXT,
        "phone" TEXT,
        "total_orders" INTEGER NOT NULL DEFAULT 0,
        "total_spent" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "sandwiches" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "ingredients" TEXT[],
        "price" DECIMAL(10,2) NOT NULL,
        "image_url" TEXT,
        "available" BOOLEAN NOT NULL DEFAULT true,
        "display_order" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "sandwiches_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "drinks" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" DECIMAL(10,2) NOT NULL,
        "image_url" TEXT,
        "available" BOOLEAN NOT NULL DEFAULT true,
        "display_order" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "drinks_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" TEXT NOT NULL,
        "order_number" TEXT NOT NULL,
        "user_id" TEXT,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "subtotal" DECIMAL(10,2) NOT NULL,
        "total" DECIMAL(10,2) NOT NULL,
        "estimated_wait_minutes" INTEGER,
        "mp_preference_id" TEXT,
        "mp_payment_id" TEXT,
        "mp_status" TEXT,
        "notes" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "orders_order_number_key" ON "orders"("order_number")`)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" TEXT NOT NULL,
        "order_id" TEXT NOT NULL,
        "item_type" TEXT NOT NULL,
        "item_id" TEXT NOT NULL,
        "item_name" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "unit_price" DECIMAL(10,2) NOT NULL,
        "subtotal" DECIMAL(10,2) NOT NULL,
        CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "settings" (
        "key" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "description" TEXT,
        CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password_hash" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_username_key" ON "admin_users"("username")`)

    // Add foreign keys (ignore if they already exist)
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`)
    } catch { /* already exists */ }

    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`)
    } catch { /* already exists */ }

    return NextResponse.json({ message: "Database setup complete" })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
