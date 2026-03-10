export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const data = await prisma.sandwich.findMany({ orderBy: { displayOrder: "asc" } })
  return NextResponse.json(data.map(s => ({ ...s, image_url: s.imageUrl, display_order: s.displayOrder, created_at: s.createdAt, updated_at: s.updatedAt })))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await prisma.sandwich.create({ data: { name: body.name, description: body.description, ingredients: body.ingredients || [], price: body.price, imageUrl: body.image_url, available: body.available ?? true, displayOrder: body.display_order || 0 } })
    return NextResponse.json(data)
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 }) }
}
