// src/pages/admin/orders.tsx
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

type Order = Awaited<ReturnType<typeof getOrders>>[number];

// --- helpers (server-only)
function parseCookieHeader(header?: string) {
  const map: Record<string, string> = {};
  if (!header) return map;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    map[k] = decodeURIComponent(rest.join("="));
  }
  return map;
}

async function verifyAdminJWT(token?: string) {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload?.sub === "admin";
  } catch {
    return false;
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookieHeader(ctx.req.headers.cookie);
  const ok = await verifyAdminJWT(cookies["admin_token"]);

  if (!ok) {
    return {
      redirect: {
        destination: `/admin/login?from=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false,
      },
    };
  }

  const orders = await getOrders();
  return { props: { orders: JSON.parse(JSON.stringify(orders)) } };
};

// --- page component (client)
export default function OrdersAdmin({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/logout");
    router.push("/admin/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders (Dev View)</h1>
        <Button variant="outline" onClick={signOut}>Sign Out</Button>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border rounded p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Order #{o.id}</p>
                <p className="text-sm text-gray-600">{o.email ?? "No email"}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {(o.amountTotal / 100).toLocaleString(undefined, {
                    style: "currency",
                    currency: (o.currency || "CAD").toUpperCase(),
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <ul className="mt-3 list-disc pl-6">
              {o.items.map((it) => (
                <li key={it.id}>
                  {it.quantity} × {it.productName} — {(it.unitAmount / 100).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
