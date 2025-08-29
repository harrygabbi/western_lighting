import type { NextApiRequest, NextApiResponse } from "next";
import { SignJWT } from "jose";

const isProd = process.env.NODE_ENV === "production";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const { email, password } = req.body || {};

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!);
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime("1d") // 1 day session
    .sign(secret);

  // HttpOnly cookie
  const cookie = [
    `admin_token=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${60 * 60 * 24}`, // 1 day
    isProd ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", cookie);
  return res.status(200).json({ ok: true });
}
