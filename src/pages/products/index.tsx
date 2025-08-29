import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";

/* ---------- Types ---------- */
type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  inStock: boolean;
};

type Category = { id: number; name: string; parentId: number | null };

type CatNode = Category & { children: CatNode[] };

/* ---------- Helpers (pure) ---------- */
function buildTree(flat: Category[]): CatNode[] {
  const byId = new Map<number, CatNode>();
  flat.forEach(c => byId.set(c.id, { ...c, children: [] }));
  const roots: CatNode[] = [];
  byId.forEach(node => {
    if (node.parentId) {
      const parent = byId.get(node.parentId);
      parent?.children.push(node);
    } else roots.push(node);
  });
  // sort each level by name
  const sortRec = (nodes: CatNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    nodes.forEach(n => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

function lineage(id: number, map: Map<number, Category>): Category[] {
  const path: Category[] = [];
  let cur = map.get(id);
  while (cur) {
    path.unshift(cur);
    cur = cur.parentId ? map.get(cur.parentId) ?? undefined : undefined;
  }
  return path;
}

function descendantIds(node: CatNode): number[] {
  const ids: number[] = [node.id];
  node.children.forEach(ch => ids.push(...descendantIds(ch)));
  return ids;
}

/* ---------- SSR ---------- */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Support ?cid (general), or legacy ?categoryId / ?mainId
  const cidParam =
    (ctx.query.cid ?? ctx.query.categoryId ?? null) as string | string[] | null;
  const mainParam = (ctx.query.mainId ?? null) as string | string[] | null;

  const cid = cidParam ? Number(Array.isArray(cidParam) ? cidParam[0] : cidParam) : null;
  const mainId = mainParam ? Number(Array.isArray(mainParam) ? mainParam[0] : mainParam) : null;

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, parentId: true },
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });

  // Build tree to compute descendants when filtering by any level
  const tree = buildTree(categories);
  const byId = new Map(categories.map(c => [c.id, c]));

  let where: any = undefined;
  if (cid) {
    // find that node and all its descendants
    const findNode = (nodes: CatNode[], id: number): CatNode | null => {
      for (const n of nodes) {
        if (n.id === id) return n;
        const hit = findNode(n.children, id);
        if (hit) return hit;
      }
      return null;
    };
    const node = findNode(tree, cid);
    const ids = node ? descendantIds(node) : [cid];
    where = { categoryId: { in: ids } };
  } else if (mainId) {
    const findNode = (nodes: CatNode[], id: number): CatNode | null => {
      for (const n of nodes) {
        if (n.id === id) return n;
        const hit = findNode(n.children, id);
        if (hit) return hit;
      }
      return null;
    };
    const node = findNode(tree, mainId);
    const ids = node ? descendantIds(node) : [mainId];
    where = { categoryId: { in: ids } };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
      selectedCid: cid ?? "",
    },
  };
};

/* ---------- UI ---------- */
export default function ProductsPage({
  products,
  categories,
  selectedCid,
}: {
  products: Product[];
  categories: Category[];
  selectedCid: number | "";
}) {
  const router = useRouter();

  // Derived structures
  const tree = useMemo(() => buildTree(categories), [categories]);
  const byId = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);
  const path = useMemo(
    () => (selectedCid ? lineage(selectedCid as number, byId) : []),
    [selectedCid, byId]
  );
  const topId = path.length ? path[0].id : null;

  // simple currency (stable SSR/CSR)
  const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  function goTo(id?: number) {
    if (!id) router.push("/products");
    else router.push(`/products?cid=${id}`);
  }

  /* Category tree component (recursive) */
  function Node({ node, depth = 0 }: { node: CatNode; depth?: number }) {
    const onPath = path.some(p => p.id === node.id);
    const isActive = selectedCid === node.id;

    return (
      <li className="py-1">
        <details open={onPath || depth === 0} className="group">
          <summary className="list-none flex items-center gap-2 cursor-pointer select-none">
            {/* caret */}
            {node.children.length > 0 ? (
              <span className="inline-block text-gray-400 group-open:rotate-90 transition transform">▸</span>
            ) : (
              <span className="inline-block w-3" />
            )}
            <button
              onClick={(e) => { e.preventDefault(); goTo(node.id); }}
              className={`text-sm px-2 py-1 rounded ${
                isActive
                  ? "bg-red-600 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              {node.name}
            </button>
          </summary>

          {node.children.length > 0 && (
            <ul className="ml-4 pl-3 border-l border-gray-200">
              {node.children.map(ch => (
                <Node key={ch.id} node={ch} depth={depth + 1} />
              ))}
            </ul>
          )}
        </details>
      </li>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <button onClick={() => goTo()} className="hover:text-gray-700">All Products</button>
        {path.map((c, i) => (
          <span key={c.id}>
            <span className="mx-2">/</span>
            {i === path.length - 1 ? (
              <span className="text-gray-900 font-medium">{c.name}</span>
            ) : (
              <button onClick={() => goTo(c.id)} className="hover:text-gray-700">{c.name}</button>
            )}
          </span>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar – Category Tree */}
        <aside className="lg:sticky lg:top-20 h-max">
          <div className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-700">Shop by Category</h2>
              <button onClick={() => goTo()} className="text-xs text-red-600 hover:underline">
                Clear
              </button>
            </div>

            {/* Mobile info */}
            <p className="lg:hidden text-xs text-gray-500 mb-2">
              Tap a category to reveal deeper levels.
            </p>

            <ul>
              {tree.map(root => (
                <Node key={root.id} node={root} />
              ))}
            </ul>
          </div>
        </aside>

        {/* Results */}
        <main>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              {path.length ? path[path.length - 1].name : "All Products"}
            </h1>
            <span className="text-sm text-gray-500">{products.length} result{products.length === 1 ? "" : "s"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map(p => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group block rounded-xl border bg-white overflow-hidden transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <div className="relative w-full h-64">
                  <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                  {!p.inStock && (
                    <span className="absolute top-3 right-3 rounded-full bg-gray-900/80 text-white text-xs px-2 py-1">
                      Out of stock
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-semibold line-clamp-1">{p.name}</h3>
                  <p className="mt-1 text-gray-500">{p.inStock ? "In stock" : "Unavailable"}</p>
                  <p className="mt-2 text-gray-800 font-semibold">{usd(p.price)}</p>
                  <span className="inline-block mt-3 text-red-600 group-hover:text-red-700 text-sm">View details →</span>
                </div>
              </Link>
            ))}
            {products.length === 0 && (
              <p className="col-span-full text-center text-gray-600">No products found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
