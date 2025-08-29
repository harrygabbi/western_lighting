// src/pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (_req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const products = await prisma.product.findMany({
    where: { inStock: true }, // only show available
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      inStock: true,
      image: true,
      description: true,
      images: {
        select: { url: true, alt: true, position: true },
        orderBy: { position: "asc" },
      },
    },
  });

  res.status(200).json(products);
}
