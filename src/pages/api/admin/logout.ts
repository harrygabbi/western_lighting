import type { NextApiRequest, NextApiResponse } from "next";

const isProd = process.env.NODE_ENV === "production";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const cookie = [
    "admin_token=",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    isProd ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ ok: true });
}
