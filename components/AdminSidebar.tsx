"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Home, Zap, CalendarCheck, Users,
  LogOut, Menu, X, Settings, ChevronRight, BarChart2,
} from "lucide-react";
import { useState } from "react";
import { adminLogout } from "@/lib/adminAuth";
import Logo from "@/components/Logo";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/listings", label: "Annonces", icon: Home },
  { href: "/admin/activities", label: "Activités", icon: Zap },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/admin/members", label: "Membres", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function isActive(link: typeof links[0]) {
    return link.exact ? pathname === link.href : pathname.startsWith(link.href);
  }

  function handleLogout() {
    adminLogout();
    router.push("/admin/login");
  }

  const Nav = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Logo size={20} />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Rachra.com</p>
            <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">Navigation</p>
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-[17px] h-[17px] shrink-0" />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          );
        })}

        <div className="pt-4 mt-2 border-t border-white/10">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">Système</p>
          <Link
            href="/admin/settings"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname.startsWith("/admin/settings")
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings className="w-[17px] h-[17px] shrink-0" />
            Paramètres
          </Link>
          <a
            href="/listings"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Home className="w-[17px] h-[17px] shrink-0" />
            Voir le site
          </a>
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold leading-none">Admin</p>
            <p className="text-gray-500 text-[11px] mt-0.5 truncate">admin@rachra.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-[#0f1117] min-h-screen fixed left-0 top-0 z-40 border-r border-white/5">
        <Nav />
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f1117] border-b border-white/10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Logo size={16} />
          </div>
          <span className="text-white font-bold text-sm">Rachra <span className="text-blue-400">Admin</span></span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-[#0f1117] border-r border-white/10 flex flex-col">
            <Nav />
          </aside>
        </div>
      )}
    </>
  );
}
