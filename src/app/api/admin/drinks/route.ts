export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const data = await prisma.drink.findMany({ orderBy: { displayOrder: "asc" } })
  return NextResponse.json(data.map(d => ({ ...d, image_url: d.imageUrl, display_order: d.displayOrder, created_at: d.createdAt, updated_at: d.updatedAt })))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await prisma.drink.create({ data: { name: body.name, description: body.description, price: body.price, imageUrl: body.image_url, available: body.available ?? true, displayOrder: body.display_order || 0 } })
    return NextResponse.json(data)
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 }) }
}
