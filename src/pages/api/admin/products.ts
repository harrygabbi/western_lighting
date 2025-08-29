import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdminApi(req, res))) return;

  try {
    if (req.method === "GET") {
      const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
      return res.status(200).json(products);
    }

    if (req.method === "POST") {
      const { name, slug, price, description, image, inStock, quantity, categoryId } = req.body || {};
      if (!name || !slug || price == null || !description || !image) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const created = await prisma.product.create({
        data: {
          name,
          slug,
          price: Number(price),
          description,
          image, // single primary image
          inStock: !!inStock,
          quantity: Number(quantity ?? 0),
          categoryId: categoryId ? Number(categoryId) : null,
        },
      });

      return res.status(201).json(created);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e.message || "Server error" });
  }
}
