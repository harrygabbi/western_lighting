'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Shop', href: '/shop' },
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

          {/* Search and Cart */}
          <button className="text-gray-700 hover:text-red-600" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="text-gray-700 hover:text-red-600" aria-label="Cart">
            <ShoppingCart size={20} />
          </button>
        </div>

        {/* Hamburger for Mobile */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ✅ Light Gray Transparent Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-200/60 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ✅ Sidebar (above overlay) */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full w-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-300">
            <span className="text-lg font-semibold text-red-600">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

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
            <div className="flex gap-4 pt-4 border-t mt-4 border-gray-300">
              <button className="text-gray-700 hover:text-red-600" aria-label="Search">
                <Search size={20} />
              </button>
              <button className="text-gray-700 hover:text-red-600" aria-label="Cart">
                <ShoppingCart size={20} />
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </header>
  );
}
