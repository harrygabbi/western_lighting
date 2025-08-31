// src/pages/admin/products/new.tsx
import { GetServerSideProps } from "next";
import { parseCookieHeader, verifyAdminJWT } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

/* ---------- Types ---------- */
type Category = { id: number; name: string; parentId: number | null };

/* ---------- SSR ---------- */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ok = await verifyAdminJWT(parseCookieHeader(ctx.req.headers.cookie)["admin_token"]);
  if (!ok) return { redirect: { destination: "/admin/login", permanent: false } };

  // Fetch flat list; we’ll organize into levels on the client
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, parentId: true },
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)) as Category[],
    },
  };
};

/* ---------- Helpers (client) ---------- */
function buildByParent(categories: Category[]) {
  const byParent = new Map<number | null, Category[]>();
  for (const c of categories) {
    const key = c.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(c);
    byParent.set(key, arr);
  }
  // sort siblings by name (stable across DBs)
  byParent.forEach((arr, key) =>
    byParent.set(key, [...arr].sort((a, b) => a.name.localeCompare(b.name)))
  );
  return byParent;
}

function buildById(categories: Category[]) {
  return new Map<number, Category>(categories.map((c) => [c.id, c]));
}

function lineage(id: number, byId: Map<number, Category>): Category[] {
  const path: Category[] = [];
  let cur = byId.get(id);
  while (cur) {
    path.unshift(cur);
    cur = cur.parentId ? byId.get(cur.parentId) : undefined;
  }
  return path;
}

/* ---------- Page ---------- */
export default function NewProduct({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const byParent = useMemo(() => buildByParent(categories), [categories]);
  const byId = useMemo(() => buildById(categories), [categories]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    quantity: "",
    image: "",
    description: "",
    inStock: true,
    categoryId: "", // final selected category (deepest)
  });

  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // --- Cascading category state: path of selected category IDs from top → leaf
  // (e.g., [TopId] or [TopId, ChildId] or [TopId, ChildId, SubChildId], …)
  const [path, setPath] = useState<number[]>([]);

  // Build levels dynamically:
  // Level 0 = top-level categories (parentId = null)
  // Level i = children of path[i-1]
  const levels = useMemo(() => {
    const lvls: Category[][] = [];
    // Level 0
    lvls.push(byParent.get(null) ?? []);
    // Next levels driven by current selections
    for (let i = 0; i < path.length; i++) {
      const parentId = path[i];
      const kids = byParent.get(parentId) ?? [];
      if (kids.length) lvls.push(kids);
      else break;
    }
    return lvls;
  }, [byParent, path]);

  // Update final categoryId whenever path changes
  const deepestId = path[path.length - 1];
  const finalCategoryId = deepestId ? String(deepestId) : "";
  if (form.categoryId !== finalCategoryId) {
    // keep form in sync without causing loops
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setTimeout(() => setForm((f) => ({ ...f, categoryId: finalCategoryId })), 0);
  }

  // UI handlers for cascading selects
  function onPick(levelIdx: number, value: string) {
    // value "" means cleared at this level ⇒ truncate path to before this level
    if (!value) {
      const next = path.slice(0, levelIdx);
      setPath(next);
      return;
    }
    const id = Number(value);
    const next = [...path.slice(0, levelIdx), id];
    setPath(next);
  }

  function clearCategory() {
    setPath([]);
    setForm((f) => ({ ...f, categoryId: "" }));
  }

  // Standard field change
  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((f) => ({
      ...f,
      [e.target.name]:
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value,
    }));
  }

  // Simple single-file upload
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

  // Pretty breadcrumb label of current selection (optional)
  const pathCats = path.map((id) => byId.get(id)).filter(Boolean) as Category[];
  const prettyTrail =
    pathCats.length > 0 ? pathCats.map((c) => c.name).join(" → ") : "None selected";

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">New Product</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic fields */}
        <input
          name="name"
          placeholder="Name"
          className="border p-2 w-full rounded"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="slug"
          placeholder="slug-like-this"
          className="border p-2 w-full rounded"
          value={form.slug}
          onChange={onChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price (cents)"
          className="border p-2 w-full rounded"
          value={form.price}
          onChange={onChange}
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity available"
          className="border p-2 w-full rounded"
          value={form.quantity}
          onChange={onChange}
          required
        />

        {/* Image upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Product Image</label>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={onFileChange} />
            {uploading && <span className="text-sm text-gray-500">Uploading…</span>}
          </div>
          <input
            name="image"
            placeholder="/uploads/your-image.jpg"
            className="border p-2 w-full rounded"
            value={form.image}
            onChange={onChange}
            required
          />
          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="mt-2 h-32 w-32 object-cover rounded border"
            />
          )}
        </div>

        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 w-full rounded"
          value={form.description}
          onChange={onChange}
          required
        />

        {/* ---------- Cascading Category Picker ---------- */}
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Category (pick from top-level down)
            </label>
            <button
              type="button"
              onClick={clearCategory}
              className="text-xs rounded-full border px-3 py-1 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>

          {/* Levels */}
          <div className="space-y-3">
            {levels.map((opts, idx) => {
              const selectedAtLevel = path[idx] ?? "";
              const label =
                idx === 0
                  ? "Top level"
                  : `Level ${idx + 1} of "${byId.get(path[idx - 1])?.name ?? ""}"`;

              return (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2">
                  <div className="text-xs text-gray-600 self-center">{label}</div>
                  <select
                    value={selectedAtLevel ? String(selectedAtLevel) : ""}
                    onChange={(e) => onPick(idx, e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    <option value="">
                      {idx === 0 ? "Select top-level" : "Select subcategory"}
                    </option>
                    {opts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Selection summary */}
          <div className="text-xs text-gray-600">
            Selected:{" "}
            <span className="font-medium text-gray-900">{prettyTrail}</span>
          </div>

          {/* Hidden binding to your existing API (deepest id) */}
          <input type="hidden" name="categoryId" value={form.categoryId} />
        </div>

        <label className="flex items-center gap-2">
          <input
            name="inStock"
            type="checkbox"
            checked={form.inStock}
            onChange={onChange}
          />
          In stock
        </label>

        <button
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          type="submit"
          disabled={!form.categoryId}
          title={!form.categoryId ? "Please choose a category" : ""}
        >
          Create
        </button>
        {err && <p className="text-red-700 text-sm">{err}</p>}
      </form>
    </div>
  );
}
