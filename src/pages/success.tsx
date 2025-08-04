// src/pages/success.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Thank You for Your Purchase!</h1>
      <p className="text-lg text-gray-700 mb-8">
        Your order has been received and is being processed. A confirmation email will be sent shortly.
      </p>
      <div className="space-x-4">
        <Link href="/products" passHref>
          <Button >Continue Shopping</Button>
        </Link>
        <Link href="/" passHref>
          <Button>Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}
