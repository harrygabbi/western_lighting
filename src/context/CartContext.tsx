import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { Product } from "@/lib/products";

type CartItem = Product & { quantity: number };

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ Load cart from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // ✅ Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => {
    setItems((curr) => {
      const existing = curr.find((i) => i.slug === product.slug);
      if (existing) {
        return curr.map((i) =>
          i.slug === product.slug ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...curr, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (slug: string) => {
    setItems((curr) => curr.filter((i) => i.slug !== slug));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
