// src/pages/admin/products/[id].tsx
import { GetServerSideProps } from "next";
import { parseCookieHeader, verifyAdminJWT } from "@/lib/adminAuth";
import { useRouter } from "next/router";
import { useState } from "react";

type Category = { id: number; name: string; parent?: { name: string } | null };
type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  inStock: boolean;
  categoryId?: number | null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ok = await verifyAdminJWT(parseCookieHeader(ctx.req.headers.cookie)["admin_token"]);
  if (!ok)
    return { redirect: { destination: "/admin/login", permanent: false } };

  const id = ctx.params?.id as string;
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || `http://${ctx.req.headers.host}`;

  const [productRes, categoriesRes] = await Promise.all([
    fetch(`${base}/api/admin/products/${id}`, {
      headers: { cookie: ctx.req.headers.cookie || "" },
    }),
    fetch(`${base}/api/admin/categories`, {
      headers: { cookie: ctx.req.headers.cookie || "" },
    }),
  ]);

  if (productRes.status === 404) return { notFound: true };

  const [product, categories] = await Promise.all([
    productRes.json(),
    categoriesRes.json(),
  ]);

  return { props: { product, categories } };
};

export default function EditProduct({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug,
    price: String(product.price),
    quantity: String(product.quantity),
    image: product.image,
    description: product.description,
    inStock: product.inStock,
    categoryId: product.categoryId ?? "",
  });
  const [err, setErr] = useState<string | null>(null);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) =>
    setForm((f) => ({
      ...f,
      [e.target.name]:
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value,
    }));

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      }),
    });
    if (res.ok) router.push("/admin/products");
    else setErr((await res.json()).message || "Failed");
  }

  async function onDelete() {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    if (res.ok) router.push("/admin/products");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={onSave} className="space-y-4">
        <input
          name="name"
          className="border p-2 w-full"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="slug"
          className="border p-2 w-full"
          value={form.slug}
          onChange={onChange}
          required
        />
        <input
          name="price"
          type="number"
          className="border p-2 w-full"
          value={form.price}
          onChange={onChange}
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity available"
          className="border p-2 w-full"
          value={form.quantity}
          onChange={onChange}
          required
        />
        <input
          name="image"
          className="border p-2 w-full"
          value={form.image}
          onChange={onChange}
          required
        />
        <textarea
          name="description"
          className="border p-2 w-full"
          value={form.description}
          onChange={onChange}
          required
        />

        {/* Category dropdown */}
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.parent ? `${c.parent.name} → ${c.name}` : c.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            name="inStock"
            type="checkbox"
            checked={form.inStock}
            onChange={onChange}
          />
          In stock
        </label>

        <div className="flex gap-3">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            type="submit"
          >
            Save
          </button>
          <button
            className="border px-4 py-2 rounded"
            type="button"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
        {err && <p className="text-red-700 text-sm">{err}</p>}
      </form>
    </div>
  );
}
