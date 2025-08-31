// src/components/Footer.tsx
import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#110c0c] text-white">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Brand / Social */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold">Western LED Lighting</h3>
            <p className="mt-3 text-white/70 leading-relaxed">
              Energy-efficient lighting and premium home improvement products for
              homes and businesses across North America.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:border-red-500 hover:bg-red-500/10 transition"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:border-red-500 hover:bg-red-500/10 transition"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 hover:border-red-500 hover:bg-red-500/10 transition"
                title="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <ul className="mt-4 space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 text-red-500" size={18} />
                <div>
                  2020 32 Avenue NE, Unit&nbsp;E
                  <br />
                  Calgary, Alberta T2W&nbsp;9A7
                  <div className="mt-1">
                    <a
                      href="https://maps.google.com/?q=2020%2032%20Avenue%20NE%20Unit%20E%20Calgary%20Alberta%20T2W9A7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Get directions →
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-red-500" size={18} />
                <a href="tel:+14037001007" className="hover:text-red-300">
                  +1 (403) 700-1007
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-red-500" size={18} />
                <a
                  href="mailto:info@westernledlighting.com"
                  className="hover:text-red-300"
                >
                  info@westernledlighting.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 text-red-500" size={18} />
                <div>
                  <div>Mon–Sat: 9:00am – 6:00pm</div>
                  <div>Sun: Closed</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-white/80">
              <li>
                <Link href="/" className="hover:text-red-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-red-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-red-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/western-starz" className="hover:text-red-300">
                  Western Starz
                </Link>
              </li>
              <li>
                <Link href="/agua-bay" className="hover:text-red-300">
                  Agua Bay
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies / Support */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="mt-4 space-y-3 text-white/80">
              <li>
                <Link href="/returns" className="hover:text-red-300">
                  Returns &amp; Shipping
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-red-300">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-red-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-red-300">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/70">
          <p>© {year} Western LED Lighting. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-red-300">
              Privacy
            </Link>
            <span className="opacity-30">•</span>
            <Link href="/terms" className="hover:text-red-300">
              Terms
            </Link>
            <span className="opacity-30">•</span>
            <Link href="/contact" className="hover:text-red-300">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
