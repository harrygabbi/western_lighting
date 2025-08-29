// src/pages/index.tsx
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { Zap, ShieldCheck, Package, Headphones } from "lucide-react";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;           // cents
  image: string;
  inStock: boolean;
  priceFormatted: string;  // preformatted on server
};
type Category = { id: number; name: string; parentId: number | null };

// --- Stable server-side price formatter (no locale surprises)
function formatMoneyServer(cents: number, currencySymbol = "$") {
  // Deterministic: no Intl on the client; add separators if you want later
  const amount = (cents / 100).toFixed(2);
  return `${currencySymbol}${amount}`;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [featuredRaw, mains] = await Promise.all([
    prisma.product.findMany({
      where: { inStock: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    }),
  ]);

  // Add a stable, preformatted price string (CAD by default)
  const featured: Product[] = featuredRaw.map((p) => ({
    ...p,
    priceFormatted: formatMoneyServer(p.price, "$"), // change symbol if needed
  }));

  const idByName: Record<string, number | undefined> = {};
  for (const c of mains) idByName[c.name] = c.id;

  return {
    props: {
      featured: JSON.parse(JSON.stringify(featured)),
      categoryIds: {
        Lighting: idByName["Lighting"] ?? null,
        Plumbing: idByName["Plumbing"] ?? null,
        Electrical: idByName["Electrical"] ?? null,
        HVAC: idByName["HVAC"] ?? null,
      },
    },
  };
};

export default function Home({
  featured,
  categoryIds,
}: {
  featured: Product[];
  categoryIds: { Lighting: number | null; Plumbing: number | null; Electrical: number | null; HVAC: number | null };
}) {
  const tiles = [
    {
      name: "Lighting",
      href: categoryIds.Lighting ? `/products?mainId=${categoryIds.Lighting}` : "/products",
      img: "/images/lighting-1.png",
    },
    {
      name: "Plumbing",
      href: categoryIds.Plumbing ? `/products?mainId=${categoryIds.Plumbing}` : "/products",
      img: "/images/lighting-2.png",
    },
    {
      name: "Electrical",
      href: categoryIds.Electrical ? `/products?mainId=${categoryIds.Electrical}` : "/products",
      img: "/images/lighting-3.png",
    },
    {
      name: "HVAC",
      href: categoryIds.HVAC ? `/products?mainId=${categoryIds.HVAC}` : "/products",
      img: "/images/lighting-1.png",
    },
  ];

  return (
    <>
      <Head>
        <title>Western Lighting — Modern Lighting, Plumbing & Electrical</title>
        <meta
          name="description"
          content="Energy-efficient lighting and premium products for homes and businesses. Shop Western Lighting for modern fixtures, reliable plumbing & electrical."
        />
      </Head>

      {/* HERO */}
      <section className="relative h-[70vh] min-h-[520px] w-full">
        <Image
          src="/images/lighting-3.png"
          alt="Modern interior lighting ambience"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Light Up Your Spaces with Style & Efficiency
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">
              Premium lighting, plumbing, and electrical solutions—built to last and designed to impress.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 transition"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 font-semibold text-white hover:bg-white hover:text-gray-900 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 md:py-10">
            <ValueProp icon={<Zap />} title="Energy Efficient" desc="LED-first, save on bills" />
            <ValueProp icon={<ShieldCheck />} title="2-Year Warranty" desc="Quality you can trust" />
            <ValueProp icon={<Package />} title="Fast Shipping" desc="Canada & USA coverage" />
            <ValueProp icon={<Headphones />} title="Expert Support" desc="Real people, real help" />
          </div>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <Link href="/products" className="text-red-600 hover:text-red-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {tiles.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group relative block rounded-xl overflow-hidden bg-white border"
              >
                <div className="relative w-full h-40 md:h-56">
                  <Image src={t.img} alt={t.name} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-gray-900">
                    {t.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Featured</h2>
            <Link href="/products" className="text-red-600 hover:text-red-700 font-medium">
              Shop all →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
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
                    {/* Use server-formatted price to avoid hydration mismatch */}
                    <p className="mt-2 text-gray-800 font-semibold">{p.priceFormatted}</p>
                    <span className="inline-block mt-3 text-red-600 hover:text-red-700 text-sm">View details →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-gray-50 p-8 text-center text-gray-600">
              No featured products yet. Add products in the admin to see them here.
            </div>
          )}
        </div>
      </section>

      {/* ABOUT / BRAND STORY */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Built on Quality. Driven by Innovation.</h2>
              <p className="text-gray-700 leading-relaxed">
                Since 2017, Western LED Lighting has grown from a small LED distributor into a full-service provider across
                lighting, plumbing, and electrical. We serve homes and businesses across North America with energy-efficient
                products, expert guidance, and friendly support.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 font-medium text-gray-900 hover:bg-white"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="relative w-full h-72 md:h-[420px] rounded-2xl overflow-hidden order-1 md:order-2 ring-1 ring-black/5">
              <Image
                src="/images/lighting-2.png"
                alt="Showcase of modern fixtures"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER / CTA */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="rounded-2xl bg-gray-900 px-6 py-10 md:px-10 md:py-14 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">Get lighting tips & exclusive offers</h3>
                <p className="mt-2 text-white/80">
                  Join our newsletter for product launches, promos, and design inspiration.
                </p>
              </div>
              <form
                className="flex items-stretch gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks for subscribing! (Wire this up to your email provider)");
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-full bg-white text-gray-900 px-4 py-3 outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* Presentational component */
function ValueProp({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 rounded-full border p-2 text-red-600">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
