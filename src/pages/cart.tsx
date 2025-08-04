// src/pages/cart.tsx
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCart();

  const handleCheckout = async () => {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Checkout failed. Try again.");
    }
  } catch (err) {
    console.error("Checkout error", err);
    alert("Something went wrong.");
  }
};


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link href="/products" className="text-red-600 hover:underline">
            Browse products.
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center space-x-4 border-b pb-4"
            >
              <div className="w-20 h-20 relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p>
                  {item.quantity} × ${(item.price / 100).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.slug)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <p className="text-xl font-bold">
              Total: ${(total / 100).toFixed(2)}
            </p>
          </div>

          <div className="mt-4 text-right">
            <Button onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
