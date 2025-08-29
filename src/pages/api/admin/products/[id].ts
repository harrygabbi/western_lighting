import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdminApi(req, res))) return;
  const id = Number(req.query.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    if (req.method === "GET") {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) return res.status(404).json({ message: "Not found" });
      return res.status(200).json(product);
    }

    if (req.method === "PUT") {
      const { name, slug, price, description, image, inStock, quantity, categoryId } = req.body || {};
      const updated = await prisma.product.update({
        where: { id },
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
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.product.delete({ where: { id } });
      return res.status(204).end();
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e.message || "Server error" });
  }
}
