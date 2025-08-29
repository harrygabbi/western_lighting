// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_PATH = "/admin";
const LOGIN_PATH = "/admin/login";

async function verifyJWT(token: string) {
  const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload && payload.sub === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin/* (but allow /admin/login)
  if (pathname.startsWith(ADMIN_PATH) && pathname !== LOGIN_PATH) {
    const cookie = req.cookies.get("admin_token")?.value;
    const ok = cookie ? await verifyJWT(cookie) : false;

    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
