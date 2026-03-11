import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "guchini-jwt-secret-key-2026-prod-32ch"
if (!process.env.ADMIN_JWT_SECRET) {
  console.warn("WARN: ADMIN_JWT_SECRET no configurado, usando fallback")
}
const secret = new TextEncoder().encode(JWT_SECRET)

// ---- Admin Auth ----
export async function signAdminToken(payload: { sub: string; username: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { sub: string; username: string }
  } catch {
    return null
  }
}

export async function getAdminFromCookie() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin_token")?.value
  if (!token) return null
  return verifyAdminToken(token)
}

// ---- Customer Auth ----
export async function signUserToken(payload: { sub: string; email: string; name: string | null }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyUserToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { sub: string; email: string; name: string | null }
  } catch {
    return null
  }
}

export async function getUserFromCookie() {
  const cookieStore = cookies()
  const token = cookieStore.get("user_token")?.value
  if (!token) return null
  return verifyUserToken(token)
}
