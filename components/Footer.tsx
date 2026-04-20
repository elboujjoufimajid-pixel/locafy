"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useT } from "@/lib/i18n";
import Logo from "@/components/Logo";

export default function Footer() {
  const { t } = useT();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={36} />
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Rachra<span className="text-blue-400 font-semibold">.com</span>
                </span>
                <p className="text-xs text-blue-300 font-medium -mt-0.5">Your place, your way</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/rachra2026/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition-colors" title="Instagram">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.navigation}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings" className="hover:text-blue-400 transition-colors">{t.footer.allListings}</Link></li>
              <li><Link href="/listings?type=apartment" className="hover:text-blue-400 transition-colors">{t.footer.apartments}</Link></li>
              <li><Link href="/listings?type=house" className="hover:text-blue-400 transition-colors">{t.footer.houses}</Link></li>
              <li><Link href="/listings?type=car" className="hover:text-blue-400 transition-colors">{t.footer.cars}</Link></li>
              <li><Link href="/activities" className="hover:text-blue-400 transition-colors">{t.footer.activities}</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link href="/dashboard/new" className="hover:text-blue-400 transition-colors">{t.footer.publish}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Oujda, Oriental, Maroc</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+212 600 287 382</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contact@rachra.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>{t.footer.copyright}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-gray-300">{t.footer.terms}</Link>
            <Link href="/about" className="hover:text-gray-300">À propos</Link>
            <a href="/admin/login" className="hover:text-blue-400 text-gray-600 text-xs">⚙ Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

