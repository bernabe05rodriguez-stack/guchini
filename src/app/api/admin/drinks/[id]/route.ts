export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await prisma.drink.findUnique({ where: { id: params.id } })
  if (!data) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json({ ...data, image_url: data.imageUrl, display_order: data.displayOrder })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const data = await prisma.drink.update({ where: { id: params.id }, data: { name: body.name, description: body.description, price: body.price, imageUrl: body.image_url, available: body.available, displayOrder: body.display_order } })
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const updateData: Record<string, unknown> = {}
  if (body.available !== undefined) updateData.available = body.available
  if (body.name) updateData.name = body.name
  if (body.price) updateData.price = body.price
  const data = await prisma.drink.update({ where: { id: params.id }, data: updateData })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.drink.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
