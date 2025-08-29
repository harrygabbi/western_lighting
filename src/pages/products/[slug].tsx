import { GetServerSideProps } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug as string;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { notFound: true };
  return { props: { product: JSON.parse(JSON.stringify(product)) as Product } };
};

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem, items } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-96">
          <Image src={product.image} alt={product.name} fill className="object-contain" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-red-600 mb-4">
            ${(product.price / 100).toFixed(2)}
          </p>
          <p className="mb-6">{product.description}</p>
          <p className="text-sm text-gray-500">
            {product.quantity > 0 ? `${product.quantity} left in stock` : "Out of stock"}
          </p>
          {product.inStock ? (
            <Button onClick={() => addItem(product as any)}>
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
