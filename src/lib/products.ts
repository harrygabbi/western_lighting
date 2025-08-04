// src/lib/products.ts

export interface Product {
  id: string;
  name: string;
  slug: string;       // used for URL: /products/[slug]
  price: number;      // in cents, e.g. 1999 === $19.99
  description: string;
  image: string;      // path under /public/images, e.g. "/images/lamp.jpg"
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Brushed Metal Table Lamp',
    slug: 'brushed-metal-table-lamp',
    price: 4999,
    description: 'A sleek table lamp with brushed metal finish—perfect for your desk or bedside.',
    image: '/images/metal-lamp.jpg',
    inStock: true,
  },
  {
    id: '2',
    name: 'Classic Edison Bulb Chandelier',
    slug: 'classic-edison-bulb-chandelier',
    price: 8999,
    description: 'Vintage-style chandelier outfitted with Edison bulbs for a warm, ambient glow.',
    image: '/images/chandelier.jpg',
    inStock: true,
  },
  {
    id: '3',
    name: 'LED Floor Lamp with Dimmer',
    slug: 'led-floor-lamp-with-dimmer',
    price: 12999,
    description: 'Energy-efficient LED floor lamp with touch-sensitive dimmer control.',
    image: '/images/floor-lamp.jpg',
    inStock: false,
  },
];
