export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string || "products"
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })
    if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "Max 2MB" }, { status: 400 })
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Solo imágenes" }, { status: 400 })

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
    await mkdir(uploadDir, { recursive: true })

    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = path.join(uploadDir, fileName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    return NextResponse.json({ url: `/uploads/${folder}/${fileName}` })
  } catch { return NextResponse.json({ error: "Error al subir" }, { status: 500 }) }
}
