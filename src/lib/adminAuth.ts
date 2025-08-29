// src/lib/adminAuth.ts
import { jwtVerify } from "jose";
import type { NextApiRequest, NextApiResponse } from "next";

export function parseCookieHeader(header?: string) {
  const map: Record<string, string> = {};
  if (!header) return map;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    map[k] = decodeURIComponent(rest.join("="));
  }
  return map;
}

export async function verifyAdminJWT(token?: string) {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload?.sub === "admin";
  } catch {
    return false;
  }
}

// For API routes
export async function requireAdminApi(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookieHeader(req.headers.cookie);
  const ok = await verifyAdminJWT(cookies["admin_token"]);
  if (!ok) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
}
