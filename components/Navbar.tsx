"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import Logo from "@/components/Logo";
import { getCurrentUser, userLogout } from "@/lib/userAuth";
import type { UserProfile } from "@/lib/userAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { lang, setLang, t } = useT();
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function handleLogout() {
    userLogout();
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
  }

  const langs: { code: Lang; label: string }[] = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "ar", label: "عربي" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={38} />
            <div className="leading-tight">
              <span className="text-[1.2rem] font-extrabold text-gray-900 tracking-tight">
                Rachra<span className="text-blue-600">.ma</span>
              </span>
              <p className="text-[0.6rem] text-blue-500 font-semibold tracking-wide uppercase -mt-0.5">
                Your place, your way
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/listings" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
              {t.nav.listings}
            </Link>
            <Link href="/listings?type=apartment" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
              {t.nav.apartments}
            </Link>
            <Link href="/listings?type=car" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
              {t.nav.cars}
            </Link>
            <Link href="/activities" className="text-gray-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1">
              <span className="text-base">🎯</span>
              {t.nav.activities}
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    lang === l.code
                      ? "bg-blue-700 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {user ? (
              // Logged-in user menu
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors text-sm"
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <span className="font-medium text-gray-800">{user.firstName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      Mon tableau de bord
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/dashboard/new"
                  className="text-blue-700 border border-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
                >
                  {t.nav.publish}
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors text-sm"
                >
                  {t.nav.login}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3">
          <Link href="/listings" className="text-gray-700 font-medium py-2" onClick={() => setOpen(false)}>
            {t.nav.listings}
          </Link>
          <Link href="/listings?type=apartment" className="text-gray-700 py-2" onClick={() => setOpen(false)}>
            {t.nav.apartments}
          </Link>
          <Link href="/listings?type=car" className="text-gray-700 py-2" onClick={() => setOpen(false)}>
            {t.nav.cars}
          </Link>
          <Link href="/activities" className="text-gray-700 py-2 flex items-center gap-1" onClick={() => setOpen(false)}>
            <span>🎯</span> {t.nav.activities}
          </Link>
          <Link href="/about" className="text-gray-700 py-2" onClick={() => setOpen(false)}>
            À propos
          </Link>
          <Link href="/contact" className="text-gray-700 py-2" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <hr />
          {/* Language switcher mobile */}
          <div className="flex items-center gap-2">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  lang === l.code
                    ? "bg-blue-700 text-white"
                    : "border border-gray-200 text-gray-500"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-center text-blue-700 border border-blue-700 px-4 py-2 rounded-lg font-medium"
                onClick={() => setOpen(false)}
              >
                Mon tableau de bord
              </Link>
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="text-center text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium text-sm"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/new"
                className="text-center text-blue-700 border border-blue-700 px-4 py-2 rounded-lg font-medium"
                onClick={() => setOpen(false)}
              >
                {t.nav.publish}
              </Link>
              <Link
                href="/auth/login"
                className="text-center bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                onClick={() => setOpen(false)}
              >
                {t.nav.login}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
