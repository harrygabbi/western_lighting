import { GetServerSideProps } from "next";
import { parseCookieHeader, verifyAdminJWT } from "@/lib/adminAuth";
import Link from "next/link";

type Product = {
  id: number; name: string; slug: string; price: number;
  inStock: boolean; image: string; description: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ok = await verifyAdminJWT(parseCookieHeader(ctx.req.headers.cookie)["admin_token"]);
  if (!ok) return { redirect: { destination: "/admin/login", permanent: false } };
  const base = process.env.NEXT_PUBLIC_BASE_URL || `http://${ctx.req.headers.host}`;
  const res = await fetch(`${base}/api/admin/products`, { headers: { cookie: ctx.req.headers.cookie || "" }});
  const products: Product[] = await res.json();
  return { props: { products } };
};

export default function AdminProductsList({ products }: { products: Product[] }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="text-white bg-red-600 px-4 py-2 rounded">New Product</Link>
      </div>
      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="border rounded p-4 flex justify-between">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-600">/{p.slug} — ${(p.price/100).toFixed(2)} — {p.inStock ? "In stock" : "Out of stock"}</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/products/${p.id}`} className="text-red-600 hover:underline">Edit</Link>
            </div>
          </div>
        ))}
        {products.length === 0 && <p>No products yet.</p>}
      </div>
    </div>
  );
}
