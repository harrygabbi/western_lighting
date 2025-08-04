// src/pages/products/[slug].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { products, Product } from "@/lib/products";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
}


export default function ProductDetail({ product }: Props) {
  const { addItem, items, total } = useCart();
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading…</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-96">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-red-600 mb-4">
            ${(product.price / 100).toFixed(2)}
          </p>
          <p className="mb-6">{product.description}</p>
          {product.inStock ? (
            <Button onClick={() => addItem(product)}>
                    Add to Cart ({items.length})
            </Button>
          ) : (
            <span className="inline-block px-4 py-2 bg-gray-200 text-gray-600 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = products.map((p) => ({
    params: { slug: p.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug;
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return { notFound: true };
  }
  return { props: { product } };
};
