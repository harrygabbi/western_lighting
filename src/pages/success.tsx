// src/pages/success.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-5xl font-extrabold text-red-600 mb-4">
        Thank You for Your Purchase!
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Your order has been received and is being processed. You’ll get a confirmation
        email shortly with the details.
      </p>
      <div className="flex space-x-4">
        <Link href="/products" passHref>
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href="/" passHref>
          <Button>Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}
