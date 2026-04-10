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
                  locafy<span className="text-blue-400 font-semibold">.ma</span>
                </span>
                <p className="text-xs text-blue-300 font-medium -mt-0.5">Your place, your way</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold">
                f
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold">
                ig
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
                <span>Casablanca, Maroc</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+212 600 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contact@locafy.ma</span>
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

