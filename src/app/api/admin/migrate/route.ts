export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const results: string[] = []
  try {
    // Add google_id column if missing
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN "google_id" TEXT UNIQUE`)
      results.push("Added google_id column")
    } catch { results.push("google_id column already exists") }

    // Make password_hash nullable if not already
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL`)
      results.push("Made password_hash nullable")
    } catch { results.push("password_hash already nullable") }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
