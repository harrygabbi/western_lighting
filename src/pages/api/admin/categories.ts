// src/pages/api/admin/categories.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdminApi(req, res))) return;

  try {
    if (req.method === "GET") {
      const categories = await prisma.category.findMany({
        include: { parent: { select: { id: true, name: true } } },
        orderBy: [
          { parent: { name: "asc" } }, // sort by parent name first
          { name: "asc" },             // then by category name
        ],
      });

      // Optional: enforce case-insensitive stable order across DBs
      categories.sort((a, b) => {
        const ak = `${a.parent?.name ?? ""}→${a.name}`;
        const bk = `${b.parent?.name ?? ""}→${b.name}`;
        return ak.localeCompare(bk, undefined, { sensitivity: "base", numeric: true });
      });

      return res.status(200).json(categories);
    }

    if (req.method === "POST") {
      const { name, parentId } = req.body || {};
      if (!name) return res.status(400).json({ message: "Name is required" });

      await prisma.category.create({
        data: { name, parentId: parentId ? Number(parentId) : null },
      });

      const categories = await prisma.category.findMany({
        include: { parent: { select: { id: true, name: true } } },
        orderBy: [
          { parent: { name: "asc" } },
          { name: "asc" },
        ],
      });

      categories.sort((a, b) => {
        const ak = `${a.parent?.name ?? ""}→${a.name}`;
        const bk = `${b.parent?.name ?? ""}→${b.name}`;
        return ak.localeCompare(bk, undefined, { sensitivity: "base", numeric: true });
      });

      return res.status(201).json(categories);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("Category API error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
