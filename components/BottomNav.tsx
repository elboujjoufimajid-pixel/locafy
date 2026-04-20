"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, CalendarCheck, User, ClipboardList } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  const tabs = [
    { href: "/", icon: Search, label: "Explorer" },
    { href: "/cherche", icon: ClipboardList, label: "Je cherche" },
    { href: "/dashboard/favoris", icon: Heart, label: "Favoris" },
    { href: "/dashboard", icon: User, label: "Compte" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
                isActive ? "text-blue-700" : "text-gray-400"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? "fill-blue-100" : ""}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-blue-700 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
