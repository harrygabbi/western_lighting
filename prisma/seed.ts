import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("🌱 Starting category seed...");

  // Top-level categories
  const electrical = await prisma.category.create({ data: { name: "Electrical" } });
  const lighting = await prisma.category.create({ data: { name: "Lighting" } });
  const plumbing = await prisma.category.create({ data: { name: "Plumbing" } });
  const hvac = await prisma.category.create({ data: { name: "HVAC" } });
  const firestop = await prisma.category.create({ data: { name: "Firestop" } });
  const water = await prisma.category.create({ data: { name: "Water Treatment Systems" } });

  // Lighting subcategories
  await prisma.category.createMany({
    data: [
      { name: "Residential Lighting", parentId: lighting.id },
      { name: "Commercial Lighting", parentId: lighting.id },
      { name: "Festival Lights", parentId: lighting.id },
      { name: "LED Drivers & Accessories", parentId: lighting.id },
    ],
  });

  // Plumbing subcategories
  await prisma.category.createMany({
    data: [
      { name: "Pipe & Tubing", parentId: plumbing.id },
      { name: "Fittings", parentId: plumbing.id },
      { name: "Glue, Sealants and Adhesives", parentId: plumbing.id },
      { name: "Valves", parentId: plumbing.id },
      { name: "Bathroom", parentId: plumbing.id },
      { name: "Other Parts & Accessories", parentId: plumbing.id },
    ],
  });

  console.log("✅ Categories seeding finished!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
