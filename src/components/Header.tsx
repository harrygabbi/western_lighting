'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext'; 

export default function Header() {
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0); 

  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Shop', href: '/products' },
    { name: 'Western Starz', href: '/western-starz' },
    { name: 'Agua Bay', href: '/agua-bay' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-red-600">
          Western Lighting
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}

          {/* Search and Cart on desktop */}
          <button className="text-gray-700 hover:text-red-600" aria-label="Search">
            <Search size={20} />
          </button>

          <Link href="/cart" className="relative text-gray-700 hover:text-red-600" aria-label="Cart">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

        </div>

        {/* Mobile right-side buttons */}
         <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative text-gray-700 hover:text-red-600" aria-label="Cart">
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="text-gray-700 hover:text-red-600"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Light gray backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-200/60 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full w-full">
          {/* Header row with logo and close button */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-300">
            <span className="text-lg font-semibold text-red-600">Western Lighting</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search button inside sidebar (mobile only) */}
          <div className="md:hidden p-4 border-b border-gray-200">
            <button className="text-gray-700 hover:text-red-600 flex items-center gap-2" aria-label="Search">
              <Search size={20} />
              <span className="font-medium">Search</span>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col p-4 space-y-4">
            {links.map(link => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-800 hover:text-red-600 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </header>
  );
}
