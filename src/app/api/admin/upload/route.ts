export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { getAdminFromCookie } from "@/lib/auth"

const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xFF, 0xD8, 0xFF],
  "image/png": [0x89, 0x50, 0x4E, 0x47],
  "image/gif": [0x47, 0x49, 0x46],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string || "products"
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })
    if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "Max 2MB" }, { status: 400 })
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Solo imágenes" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    // Validate magic bytes
    const expectedBytes = MAGIC_BYTES[file.type]
    if (!expectedBytes || !expectedBytes.every((b, i) => buffer[i] === b)) {
      return NextResponse.json({ error: "Archivo no es una imagen válida" }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
    await mkdir(uploadDir, { recursive: true })

    const ext = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    return NextResponse.json({ url: `/uploads/${folder}/${fileName}` })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Error al subir" }, { status: 500 })
  }
}
