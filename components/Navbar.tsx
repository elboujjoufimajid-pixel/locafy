"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Globe, Home, Car, Zap, Plus, ClipboardList } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import Logo from "@/components/Logo";
import { getCurrentUser, userLogout } from "@/lib/userAuth";
import type { UserProfile } from "@/lib/userAuth";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/listings", icon: Home, labelKey: "listings" },
  { href: "/listings?type=car", icon: Car, labelKey: "cars" },
  { href: "/activities", icon: Zap, labelKey: "activities" },
  { href: "/cherche", icon: ClipboardList, label: "Je cherche" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { lang, setLang, t } = useT();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    function syncAuth() { setUser(getCurrentUser()); }
    window.addEventListener("rachra_auth_change", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("rachra_auth_change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setLangMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    userLogout();
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
  }

  const langs: { code: Lang; label: string; flag: string }[] = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇲🇦" },
  ];
  const currentLang = langs.find((l) => l.code === lang)!;

  return (
    <nav className="bg-[#003580] sticky top-0 z-50 shadow-md">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Logo size={34} />
            <div className="leading-tight">
              <span className="text-[1.15rem] font-extrabold text-white tracking-tight">
                Rachra<span className="text-[#febb02]">.Com</span>
              </span>
              <p className="text-[0.55rem] text-blue-200 font-semibold tracking-widest uppercase -mt-0.5">
                Your place, your way
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1 mx-6">
            {NAV_LINKS.map((link) => {
              const label = link.label ?? (t.nav as Record<string, string>)[link.labelKey!] ?? link.labelKey;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/90 hover:text-white hover:bg-white/15 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Publish button */}
            {user && (
              <Link
                href="/dashboard/new"
                className="flex items-center gap-1.5 text-white border border-white/40 hover:bg-white/15 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.nav.publish}
              </Link>
            )}

            {/* Language picker */}
            <div ref={langMenuRef} className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 text-white/90 hover:text-white hover:bg-white/15 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang.flag} {currentLang.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden z-50">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        lang === l.code
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      {l.label}
                      {lang === l.code && <span className="ml-auto w-2 h-2 rounded-full bg-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User menu / Auth */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 px-3 py-1.5 rounded-full transition-all"
                >
                  <div className="w-6 h-6 bg-[#febb02] rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#003580] text-xs font-black">
                      {(user.firstName?.[0] ?? "U").toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white">{user.firstName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden z-50">
                    {/* Profile header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="font-semibold text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      Mon tableau de bord
                    </Link>
                    <Link
                      href="/dashboard/new"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Plus className="w-4 h-4 text-gray-400" />
                      Publier une annonce
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/register"
                  className="text-white/90 hover:text-white hover:bg-white/15 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                >
                  S&apos;inscrire
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-white text-[#003580] hover:bg-blue-50 px-4 py-1.5 rounded-full text-sm font-bold transition-all"
                >
                  {t.nav.login}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/15 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#003580] border-t border-white/10 px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const label = link.label ?? (t.nav as Record<string, string>)[link.labelKey!] ?? link.labelKey;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/90 hover:bg-white/10 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}

          <hr className="border-white/10 my-2" />

          {/* Language switcher mobile */}
          <div className="flex items-center gap-2 px-2">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  lang === l.code
                    ? "bg-[#febb02] text-[#003580]"
                    : "border border-white/30 text-white/80"
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>

          <hr className="border-white/10 my-2" />

          {user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 bg-[#febb02] rounded-full flex items-center justify-center">
                  <span className="text-[#003580] text-sm font-black">{(user.firstName?.[0] ?? "U").toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-white/50 text-xs">{user.email}</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="text-white/90 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 opacity-60" /> Mon tableau de bord
              </Link>
              <Link
                href="/dashboard/new"
                className="text-white/90 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Plus className="w-4 h-4 opacity-60" /> Publier une annonce
              </Link>
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="text-red-400 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/auth/register"
                className="text-center border border-white/40 text-white py-2.5 rounded-xl text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                S&apos;inscrire
              </Link>
              <Link
                href="/auth/login"
                className="text-center bg-[#febb02] text-[#003580] py-2.5 rounded-xl text-sm font-bold"
                onClick={() => setOpen(false)}
              >
                {t.nav.login}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
