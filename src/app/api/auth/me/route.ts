export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { verifyUserToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("user_token")?.value
  if (!token) return NextResponse.json({ user: null })
  const userData = await verifyUserToken(token)
  if (!userData) return NextResponse.json({ user: null })
  return NextResponse.json({ user: { id: userData.sub, email: userData.email, fullName: userData.name } })
}
