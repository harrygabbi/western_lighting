// prisma/seed.ts
import { prisma } from "../src/lib/prisma";

type Node = { name: string; children?: (Node | string)[] };

// ---------- CATEGORY TREE FROM YOUR SHEETS ----------
const tree: Node[] = [
  // ELECTRICAL (plus the deep sets we already did)
  {
    name: "Electrical",
    children: [
      {
        name: "BOXES",
        children: [
          "POST BOX",
          "BOX EXTENSIONS",
          "METALLIC DEVICE BOXES",
          "METALLIC OCATGON BOXES",
          "PLASTIC BOXES",
          "PVC JUNCTION BOXES",
          "WEATHERPROOF METAL BOXES",
          "STEEL STUD BOXES",
          "BRICK AND SIDING BOXES",
          "MASONRY BOXES",
          "ICF BOXES",
          "METALLIC 347 HV BOXES",
          "SQUARE JUNCTION BOXES",
          "PVC JUNCTION BOX",
          "FLOOR AND COUNTER BOXES",
          "LOW VOLTAGE WALL BRACKETS",
          "WEATHERPROOF COVERS",
          "METAL BOX COVERS",
          "CATHEDRAL CEILING BOX",
          "VAPOUR BARRIER",
          "MISC BOXES",
          "SCREW COVER JUNCTION BOXES",
          "HINGED COVER JUNCTION BOXES",
          "SPLITTER BOXES",
        ],
      },
      {
        name: "BREAKERS PANELS DISCONNECT SWITCHES",
        children: [
          "PANELS AND LOADCENTERS",
          "AC DISCONNECTS",
          "SINGLE PHASE DISCONNECT SWITCHES",
          "3 PHASE DISCONNECT SWITCHES",
          "SPA KITS",
          "EATON PUSH ON BREAKERS",
          "SIEMENS PUSH ON BREAKER",
          "HOMELINE PUSH ON CIRCUIT BREAKERS",
          "GENERAL ELECTRIC PUSH ON BREAKERS",
          "EATON BOLT ON BREAKERS",
          "SIEMENS BOLT ON BREAKERS",
          "COMMANDER QBH BREAKERS",
          "COMMANDER BQL BREAKERS",
          "GENERAL ELECTRIC BOLT ON BREAKERS",
        ],
      },
      {
        name: "WIRING DEVICES",
        children: [
          "SMART WIFI DEVICES",
          "SMOKE CO ALARMS",
          "DOOR CHIMES",
          "DECORATIVE SWITCHES",
          "DECORATIVE RECEPTACLES",
          "DIMMERS",
          "USB RECEPTACLES",
          "GFCI RECEPTACLES",
          "AFCI RECEPTACLES",
          "AFCI/GFCI RECEPTACLES",
          "FAN SPEED CONTROL",
          "HUMIDITY SENSOR",
          "OCCUPANCY SENSORS",
          "TIMERS",
          "COMBINATION DEVICES",
          "CORD CAPS",
          "LAMP HOLDERS",
          "TOGGLE SWITCHES",
          "DUPLEX RECEPTACLES",
          "COMMERCIAL RECEPTACLES",
          "30A PLUS",
          "METAL BOX COVERS",
          "DECORATIVE WALL PLATES",
          "SCREWLESS WALL PLATES",
          "BLANK WALL PLATES",
          "DUPLEX WALL PLATES",
          "TOGGLE WALL PLATES",
          "COMBINATION WALL PLATES",
          "STAINLESS STEEL WALL PLATES",
          "SINGLE RECEPTACLE WALL PLATES",
          "ROUND COVERS",
        ],
      },
    ],
  },

  // LIGHTING
  {
    name: "Lighting",
    children: [
      {
        name: "Residential Lighting",
        children: [
          {
            name: "Indoor",
            children: [
              "Pendants",
              "Surface Mount",
              "Sconces",
              "Vanity Lights",
              "Vanity Mirrors",
              "Step Lights",
              "Table & Floor Lights",
              "Flush Mounts",
              "Recessed",
              "Pucks",
              "Linear",
              "Strip/Tape",
            ],
          },
          {
            name: "Outdoor",
            children: [
              "Wall Light",
              "Step & Deck Lights",
              "Tape",
              "Solar Lights",
              "Bollards",
              "Security Light",
            ],
          },
        ],
      },
      {
        name: "Commercial Lighting",
        children: [
          { name: "Indoor" },
          { name: "Outdoor" },
        ],
      },
      { name: "Festival Lights" },
      {
        name: "LED Drivers & Accessories",
        children: [
          {
            name: "Constant Driver",
            children: [
              { name: "Indoor", children: ['12V', '24V'] },
              { name: "Outdoor", children: ['12V', '24V'] },
            ],
          },
        ],
      },
    ],
  },

  // PLUMBING
  {
    name: "Plumbing",
    children: [
      {
        name: "Pipe & Tubing",
        children: [
          "ABS (DWV) Pipe",
          "PEX Pipe",
          "Copper Pipe",
          "PVC Pipe",
          "Black Steel Pipe",
          "CPVC Pipe",
        ],
      },
      {
        name: "Fittings",
        children: [
          "ABS (DWV) Fittings",
          "PEX Fittings",
          "Black Steel Fittings",
          "Copper Fittings",
          "Brass Fittings",
          "CPVC Fittings",
          "PVC Fittings",
          "Push In Fittings",
          "Flexible Fittings",
        ],
      },
      {
        name: "Glue, Sealants and Adhesives",
        children: [
          "Glues",
          "Silicone Caulks",
          "Putties",
          "Thread & Gasket Sealants",
          "Cements & Primers",
          "Paste",
        ],
      },
      {
        name: "Valves",
        children: [
          "Stop Valves",
          "Waste Valves",
          "Gas Valves",
          "Gate Valves",
          "Other Valves",
        ],
      },
      {
        name: "Other Parts and Accessories",
        children: ["Drainage & Grease Traps"],
      },
      {
        name: "Bathroom",
        children: [
          "Shower & Trim",
          "Bathroom Rough In",
          { name: "Faucets", children: ["Kitchen Faucets", "Bathroom Faucets", "Sensor Faucets"] },
          { name: "Sinks", children: ["Kitchen Sinks", "Bathroom Sinks", "Laundry Sinks", "Mop Sinks"] },
          {
            name: "Showers",
            children: [
              {
                name: "Shower Bases",
                children: [
                  { name: "Shower Size", children: ['60"x36"', '60"x32"', '60"x30"', '48"x36"', '48"x32"', '36"x36"'] },
                  { name: "Drain Location", children: ["Center", "Left", "Right"] },
                ],
              },
            ],
          },
          {
            name: "Bathtubs",
            children: [
              "Alcove Bathtubs",
              { name: "Bathtubs Size", children: ['60"x36"', '60"x32"', '60"x30"'] },
              { name: "Drain Location", children: ["Center", "Left", "Right"] },
              { name: "Freestanding", children: [{ name: "Freestanding Size" }] },
            ],
          },
          {
            name: "Toilets",
            children: ["1-Piece", "2-Piece", "Toilet Parts & Accessories"],
          },
          {
            name: "Bidet",
            children: ["Non Electric Bidet", "Smart Bidet", "Smart Toilet", "Bidet Parts & Accessories"],
          },
          {
            name: "Bathtub Doors and Shower Doors",
            children: [
              { name: "Door Hardware Finish", children: ["Black", "Chrome"] },
              { name: "Size" },
            ],
          },
          "Bathroom Hand Dryers",
        ],
      },
    ],
  },

  // APPLIANCES
  {
    name: "Appliances",
    children: [
      {
        name: "Range Hoods",
        children: [
          "Wall-Mounted Range Hoods",
          "Undercabinet Range Hoods",
          "Inserts",
          "Island Range Hoods",
          "Garage Fan",
          "Over The Range",
        ],
      },
    ],
  },

  // OTHER TOP LEVELS
  { name: "HVAC" },
  { name: "Firestop" },
  { name: "Water Treatment Systems" },
];

// --------- HELPERS (idempotent recursive insert) ----------
async function ensureCategory(name: string, parentId: number | null = null) {
  const existing = await prisma.category.findFirst({ where: { name, parentId } });
  if (existing) return existing;
  return prisma.category.create({ data: { name, parentId } });
}

async function insertNode(node: Node | string, parentId: number | null) {
  if (typeof node === "string") {
    await ensureCategory(node, parentId);
    return;
  }
  const created = await ensureCategory(node.name, parentId);
  if (node.children && node.children.length) {
    for (const child of node.children) {
      await insertNode(child, created.id);
    }
  }
}

async function main() {
  console.log("🌱 Seeding full category tree...");
  for (const root of tree) {
    await insertNode(root, null);
  }
  console.log("✅ Done.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
