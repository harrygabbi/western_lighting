import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminApi } from "@/lib/adminAuth";
import { IncomingForm } from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = { api: { bodyParser: false } };

function safeName(name: string) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext).replace(/[^a-z0-9-_]/gi, "-");
  const stamp = Date.now();
  return `${base}-${stamp}${ext}`;
}

async function parseForm(req: NextApiRequest): Promise<{ url: string }> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const form = new IncomingForm({ multiples: false, keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, _fields, files: any) => {
      if (err) return reject(err);

      const f = Array.isArray(files.file) ? files.file[0]
            : files.file || files.image || files.upload;
      if (!f) return reject(new Error("No file uploaded"));

      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
      if (f.mimetype && !allowed.includes(f.mimetype)) {
        return reject(new Error("Unsupported file type"));
      }

      const targetName = safeName(f.originalFilename || "image");
      const targetPath = path.join(uploadDir, targetName);

      try {
        await fs.rename(f.filepath, targetPath);
      } catch {
        await fs.copyFile(f.filepath, targetPath);
        await fs.unlink(f.filepath);
      }

      resolve({ url: `/uploads/${targetName}` });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdminApi(req, res))) return;
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { url } = await parseForm(req);
    return res.status(200).json({ url });
  } catch (e: any) {
    console.error("Upload error:", e);
    return res.status(400).json({ message: e.message || "Upload failed" });
  }
}
