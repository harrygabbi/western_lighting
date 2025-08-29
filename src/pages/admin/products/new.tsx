import { GetServerSideProps } from "next";
import { parseCookieHeader, verifyAdminJWT } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { useState } from "react";

type Category = {
  id: number;
  name: string;
  parent?: { id: number; name: string } | null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ok = await verifyAdminJWT(parseCookieHeader(ctx.req.headers.cookie)["admin_token"]);
  if (!ok) return { redirect: { destination: "/admin/login", permanent: false } };

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: { children: { orderBy: { name: "asc" } } }, // for nicer labeling if you want
  });

  // flatten to options: Parent and Parent → Child
  const flat: Category[] = [];
  for (const p of categories) {
    flat.push({ id: p.id, name: p.name, parent: null });
    for (const c of (p as any).children) {
      flat.push({ id: c.id, name: c.name, parent: { id: p.id, name: p.name } });
    }
  }

  return { props: { categories: JSON.parse(JSON.stringify(flat)) as Category[] } };
};

export default function NewProduct({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    quantity: "",
    image: "",
    description: "",
    inStock: true,
    categoryId: "",
  });
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) =>
    setForm((f) => ({
      ...f,
      [e.target.name]:
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value,
    }));

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => ({ ...f, image: url }));
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.message || "Upload failed");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/admin/products", {
      method: "POST",
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">New Product</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="name" placeholder="Name" className="border p-2 w-full" value={form.name} onChange={onChange} required />
        <input name="slug" placeholder="slug-like-this" className="border p-2 w-full" value={form.slug} onChange={onChange} required />
        <input name="price" type="number" placeholder="Price (cents)" className="border p-2 w-full" value={form.price} onChange={onChange} required />
        <input name="quantity" type="number" placeholder="Quantity available" className="border p-2 w-full" value={form.quantity} onChange={onChange} required />

        {/* Single image upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Product Image</label>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={onFileChange} />
            {uploading && <span className="text-sm text-gray-500">Uploading…</span>}
          </div>
          <input
            name="image"
            placeholder="/uploads/your-image.jpg"
            className="border p-2 w-full"
            value={form.image}
            onChange={onChange}
            required
          />
          {form.image && (
            <img src={form.image} alt="preview" className="mt-2 h-32 w-32 object-cover rounded border" />
          )}
        </div>

        <textarea name="description" placeholder="Description" className="border p-2 w-full" value={form.description} onChange={onChange} required />

        <select name="categoryId" value={form.categoryId} onChange={onChange} className="border p-2 w-full" required>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.parent ? `${c.parent.name} → ${c.name}` : c.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input name="inStock" type="checkbox" checked={form.inStock} onChange={onChange} />
          In stock
        </label>

        <button className="bg-red-600 text-white px-4 py-2 rounded" type="submit">Create</button>
        {err && <p className="text-red-700 text-sm">{err}</p>}
      </form>
    </div>
  );
}
