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

/* ---------- Pure helpers ---------- */
function buildTree(flat: Category[]): CatNode[] {
  const byId = new Map<number, CatNode>();
  flat.forEach((c) => byId.set(c.id, { ...c, children: [] }));
  const roots: CatNode[] = [];
  byId.forEach((node) => {
    if (node.parentId) {
      const parent = byId.get(node.parentId);
      parent?.children.push(node);
    } else {
      roots.push(node);
    }
  });
  const sortRec = (nodes: CatNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    nodes.forEach((n) => sortRec(n.children));
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
  node.children.forEach((ch) => ids.push(...descendantIds(ch)));
  return ids;
}

/* ---------- SSR ---------- */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cidParam =
    (ctx.query.cid ?? ctx.query.categoryId ?? null) as string | string[] | null;
  const mainParam = (ctx.query.mainId ?? null) as string | string[] | null;

  const cid = cidParam ? Number(Array.isArray(cidParam) ? cidParam[0] : cidParam) : null;
  const mainId = mainParam ? Number(Array.isArray(mainParam) ? mainParam[0] : mainParam) : null;

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, parentId: true },
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });

  const tree = buildTree(categories);

  const findNode = (nodes: CatNode[], id: number): CatNode | null => {
    for (const n of nodes) {
      if (n.id === id) return n;
      const hit = findNode(n.children, id);
      if (hit) return hit;
    }
    return null;
  };

  let where: any = undefined;
  if (cid) {
    const node = findNode(tree, cid);
    const ids = node ? descendantIds(node) : [cid];
    where = { categoryId: { in: ids } };
  } else if (mainId) {
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

/* ---------- Page ---------- */
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
  const byId = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const path = useMemo(
    () => (selectedCid ? lineage(selectedCid as number, byId) : []),
    [selectedCid, byId]
  );

  // Sidebar state
  const [q, setQ] = useState("");
  const [expandAll, setExpandAll] = useState(false);
  const [treeVersion, setTreeVersion] = useState(0); // force remount to collapse all

  // Filtered tree (search)
  function filterNodes(nodes: CatNode[], query: string): CatNode[] {
    if (!query.trim()) return nodes;
    const ql = query.toLowerCase();
    const walk = (list: CatNode[]): CatNode[] =>
      list
        .map((n) => {
          const selfMatch = n.name.toLowerCase().includes(ql);
          const kids = walk(n.children);
          if (selfMatch || kids.length) return { ...n, children: kids };
          return null;
        })
        .filter(Boolean) as CatNode[];
    return walk(nodes);
  }
  const filteredTree = useMemo(() => filterNodes(tree, q), [tree, q]);

  // Navigation
  function goTo(id?: number) {
    if (!id) {
      router.push("/products");
      // also collapse everything & reset sidebar UI
      setExpandAll(false);
      setQ("");
      setTreeVersion((v) => v + 1);
    } else {
      router.push(`/products?cid=${id}`);
    }
  }

  // Currency (SSR/CSR-stable)
  const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  /* ---------- Category Tree Node ---------- */
  function Node({ node }: { node: CatNode }) {
    const onPath = path.some((p) => p.id === node.id);
    const isActive = selectedCid === node.id;

    return (
      <li className="py-1">
        <details
          // collapsed by default; opens if it's in current path or if "expand all"
          open={expandAll || onPath}
          className="group"
        >
          <summary className="list-none flex items-center gap-2 cursor-pointer select-none rounded-md px-2 py-1 hover:bg-gray-50">
            {/* caret */}
            {node.children.length > 0 ? (
              <svg
                className="h-3 w-3 text-gray-400 transition-transform group-open:rotate-90"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 5l6 5-6 5V5z" />
              </svg>
            ) : (
              <span className="inline-block w-3" />
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                goTo(node.id);
              }}
              className={`text-sm px-2 py-0.5 rounded transition ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              {node.name}
            </button>
          </summary>

          {node.children.length > 0 && (
            <ul className="ml-4 pl-3">
              {node.children.map((ch) => (
                <Node key={ch.id} node={ch} />
              ))}
            </ul>
          )}
        </details>
      </li>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <button onClick={() => goTo()} className="hover:text-gray-700">
          All Products
        </button>
        {path.map((c, i) => (
          <span key={c.id}>
            <span className="mx-2">/</span>
            {i === path.length - 1 ? (
              <span className="text-gray-900 font-medium">{c.name}</span>
            ) : (
              <button onClick={() => goTo(c.id)} className="hover:text-gray-700">
                {c.name}
              </button>
            )}
          </span>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* ---------- Sidebar ---------- */}
        <aside className="lg:sticky lg:top-20 h-max">
          <div className="rounded-2xl border bg-white shadow-sm">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  Browse Categories
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandAll(true)}
                    className="text-xs rounded-full border px-2 py-1 hover:bg-gray-50"
                  >
                    Expand all
                  </button>
                  <button
                    onClick={() => {
                      setExpandAll(false);
                      setTreeVersion((v) => v + 1); // force collapse
                    }}
                    className="text-xs rounded-full border px-2 py-1 hover:bg-gray-50"
                  >
                    Collapse all
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mt-3 relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search categories…"
                  className="w-full rounded-lg border px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.9 14.32a7 7 0 111.414-1.414l3.387 3.387-1.414 1.414-3.387-3.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Tree */}
            <div className="p-4">
              {/* Mobile hint */}
              <p className="lg:hidden text-xs text-gray-500 mb-2">
                Tap a category to reveal deeper levels.
              </p>

              <ul key={`tree-${treeVersion}`}>
                {filteredTree.map((root) => (
                  <Node key={root.id} node={root} />
                ))}
              </ul>

              {/* Clear selection */}
              <div className="pt-3 border-t mt-3 flex items-center justify-between">
                <button
                  onClick={() => goTo()}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear selection
                </button>
                {q && (
                  <button
                    onClick={() => setQ("")}
                    className="text-xs rounded-full border px-2 py-1 hover:bg-gray-50"
                  >
                    Reset search
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ---------- Results ---------- */}
        <main>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              {path.length ? path[path.length - 1].name : "All Products"}
            </h1>
            <span className="text-sm text-gray-500">
              {products.length} result{products.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group block rounded-xl border bg-white overflow-hidden transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  {!p.inStock && (
                    <span className="absolute top-3 right-3 rounded-full bg-gray-900/80 text-white text-xs px-2 py-1">
                      Out of stock
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-semibold line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-gray-500">
                    {p.inStock ? "In stock" : "Unavailable"}
                  </p>
                  <p className="mt-2 text-gray-800 font-semibold">
                    {usd(p.price)}
                  </p>
                  <span className="inline-block mt-3 text-red-600 group-hover:text-red-700 text-sm">
                    View details →
                  </span>
                </div>
              </Link>
            ))}
            {products.length === 0 && (
              <p className="col-span-full text-center text-gray-600">
                No products found.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
