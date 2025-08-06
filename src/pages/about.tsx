// src/pages/about.tsx

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Western Lighting</title>
      </Head>

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <Image
          src="/images/AboutPage-1.png"
          alt="Modern lighting"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
            Lighting the Future with Innovation
          </h1>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Learn More About Us</h2>
        <p className="text-gray-700 text-lg mb-4">
          With years of expertise in LED lighting, <strong>Western LED Lighting</strong> is dedicated to providing cutting-edge solutions for homes, businesses, and industries.
          Our mission is to revolutionize lighting with energy-efficient, long-lasting, and eco-friendly products tailored to modern needs.
        </p>
        <p className="text-gray-700 text-lg">
          Founded in 2017 and headquartered in Calgary, Alberta, Canada — we quickly expanded from a small distributor of LED products into a comprehensive lighting service enterprise.
          We now offer full solutions across lighting, plumbing, and electrical needs. Our team integrates research and development, production, sales, and support to serve all of North America.
        </p>
      </section>

      {/* Who We Are & Mission */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-10">
          {/* Who We Are */}
          <div>
            <h3 className="text-2xl font-bold text-red-600 mb-3">Who We Are</h3>
            <p className="text-gray-700 text-lg">
              We are a trusted provider of premium products, offering a diverse range of solutions across multiple industries.
              With a commitment to quality, innovation, and customer satisfaction, we aim to create a seamless shopping experience for our clients.
            </p>
          </div>

          {/* Our Mission */}
          <div>
            <h3 className="text-2xl font-bold text-red-600 mb-3">Our Mission</h3>
            <p className="text-gray-700 text-lg">
              We strive to deliver high-quality, innovative, and sustainable products that enhance everyday living.
              Our focus is on providing reliable solutions that meet customer needs while ensuring efficiency and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="container mx-auto px-4 py-12 max-w-6xl">
        <h2 className="text-2xl font-bold text-red-600 mb-6">Lighting Inspiration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Image
            src="/images/lighting-1.png"
            alt="Lighting Example 1"
            width={500}
            height={300}
            className="rounded-lg object-cover w-full h-60"
          />
          <Image
            src="/images/lighting-2.png"
            alt="Lighting Example 2"
            width={500}
            height={300}
            className="rounded-lg object-cover w-full h-60"
          />
          <Image
            src="/images/lighting-3.png"
            alt="Lighting Example 3"
            width={500}
            height={300}
            className="rounded-lg object-cover w-full h-60"
          />
        </div>

        {/* Single Shop Now Button at End */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block bg-red-600 text-white px-8 py-3 text-lg font-medium rounded hover:bg-red-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}
