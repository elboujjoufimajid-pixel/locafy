"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Reservation } from "@/lib/adminStore";
import { getCurrentUser, userLogout } from "@/lib/userAuth";
import type { UserProfile } from "@/lib/userAuth";
import {
  ChevronRight, LogOut, Star, CreditCard, Wallet, Receipt,
  User, Lock, Users, Sliders, Mail, HelpCircle, Shield,
  Map, Heart, PlusCircle, CheckCircle2, Clock, XCircle,
  Calendar, Award
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

const statusConfig = {
  confirmed: { label: "Confirmée", cls: "bg-green-100 text-green-700", icon: CheckCircle2 },
  pending: { label: "En attente", cls: "bg-yellow-100 text-yellow-700", icon: Clock },
  cancelled: { label: "Annulée", cls: "bg-red-100 text-red-700", icon: XCircle },
};

function getGenius(count: number) {
  if (count >= 15) return { level: 3, next: null, needed: 0, perks: ["20% réduction", "Petit-déjeuner offert", "Surclassement gratuit", "Support prioritaire"] };
  if (count >= 5)  return { level: 2, next: 3, needed: 15 - count, perks: ["15% réduction", "Petit-déjeuner offert", "Support prioritaire"] };
  return { level: 1, next: 2, needed: 5 - count, perks: ["10% réduction sur les logements", "Offres exclusives"] };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/auth/login"); return; }
    setUser(u);
    fetch(`/api/db/reservations?email=${encodeURIComponent(u.email)}`)
      .then((r) => r.json())
      .then((data) => setReservations(Array.isArray(data) ? data : []));
    setReady(true);
  }, [router]);

  function handleLogout() {
    userLogout();
    router.push("/");
  }

  if (!ready) return null;

  const confirmed = reservations.filter(r => r.status === "confirmed");
  const totalSpent = confirmed.reduce((s, r) => s + r.total, 0);
  const genius = getGenius(confirmed.length);
  const progressPct = genius.next
    ? Math.round(((confirmed.length - (genius.level === 1 ? 0 : 5)) / (genius.needed + (genius.level === 1 ? confirmed.length : confirmed.length - 5))) * 100)
    : 100;

  const accountSections = [
    {
      title: "Informations de paiement",
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50",
      items: [
        { icon: Wallet, label: "Récompenses & Portefeuille", href: "/dashboard" },
        { icon: CreditCard, label: "Modes de paiement", href: "/dashboard" },
        { icon: Receipt, label: "Transactions", href: "/dashboard" },
      ],
    },
    {
      title: "Gérer mon compte",
      icon: User,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      items: [
        { icon: User, label: "Informations personnelles", href: "/dashboard" },
        { icon: Lock, label: "Sécurité et mot de passe", href: "/dashboard" },
        { icon: Users, label: "Autres voyageurs", href: "/dashboard" },
      ],
    },
    {
      title: "Préférences",
      icon: Sliders,
      color: "text-purple-600",
      bg: "bg-purple-50",
      items: [
        { icon: Sliders, label: "Préférences de personnalisation", href: "/dashboard" },
        { icon: Mail, label: "Préférences email", href: "/dashboard" },
      ],
    },
    {
      title: "Activité de voyage",
      icon: Map,
      color: "text-orange-600",
      bg: "bg-orange-50",
      items: [
        { icon: Calendar, label: "Mes réservations", href: "/dashboard#reservations" },
        { icon: Heart, label: "Mes favoris", href: "/dashboard/favoris" },
        { icon: Star, label: "Mes avis", href: "/dashboard" },
      ],
    },
    {
      title: "Aide et support",
      icon: HelpCircle,
      color: "text-teal-600",
      bg: "bg-teal-50",
      items: [
        { icon: HelpCircle, label: "Centre d'aide", href: "/contact" },
        { icon: Mail, label: "Nous contacter", href: "/contact" },
      ],
    },
    {
      title: "Juridique et confidentialité",
      icon: Shield,
      color: "text-gray-600",
      bg: "bg-gray-100",
      items: [
        { icon: Shield, label: "Politique de confidentialité", href: "/privacy" },
        { icon: Receipt, label: "Conditions d'utilisation", href: "/terms" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top header bar */}
      <div style={{ backgroundColor: "#003580" }} className="text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm mb-0.5">Bonjour,</p>
            <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
            <p className="text-blue-200 text-sm mt-0.5">{user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/new"
              className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-white/20">
              <PlusCircle className="w-4 h-4" />
              Publier une annonce
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Genius / Rewards card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left — rewards info */}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    Vous avez {confirmed.length} réservation{confirmed.length !== 1 ? "s" : ""} confirmée{confirmed.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-gray-500 text-sm">Profitez de vos avantages Rachra Premium</p>
                </div>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Total dépensé", value: formatPrice(totalSpent), icon: "💰" },
                  { label: "Confirmées", value: confirmed.length, icon: "✅" },
                  { label: "En attente", value: reservations.filter(r => r.status === "pending").length, icon: "⏳" },
                  { label: "Annulées", value: reservations.filter(r => r.status === "cancelled").length, icon: "❌" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="font-bold text-gray-900">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              {genius.next && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">Niveau {genius.level} → Niveau {genius.next}</span>
                    <span className="text-xs font-semibold text-blue-700">Plus que {genius.needed} réservation{genius.needed > 1 ? "s" : ""}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%`, backgroundColor: "#003580" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right — level badge */}
            <div style={{ backgroundColor: "#003580" }} className="md:w-52 p-6 flex flex-col items-center justify-center text-white text-center">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl font-black text-[#003580]">{genius.level}</span>
              </div>
              <p className="font-bold text-lg mb-1">Niveau {genius.level}</p>
              <p className="text-blue-200 text-xs mb-3">Rachra Premium</p>
              <div className="space-y-1 w-full">
                {genius.perks.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 text-xs text-blue-100">
                    <CheckCircle2 className="w-3 h-3 text-yellow-400 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Account sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accountSections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div key={section.title} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.bg}`}>
                    <SectionIcon className={`w-4 h-4 ${section.color}`} />
                  </div>
                  <h2 className="font-semibold text-gray-900 text-sm">{section.title}</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                      >
                        <ItemIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent reservations */}
        <div id="reservations" className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Mes réservations récentes</h2>
            <Link href="/listings" className="text-xs text-blue-700 font-medium hover:underline flex items-center gap-1">
              <PlusCircle className="w-3.5 h-3.5" />
              Nouvelle réservation
            </Link>
          </div>

          {reservations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm">Aucune réservation pour l&apos;instant</p>
              <Link href="/listings"
                className="inline-flex items-center gap-2 mt-4 bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors">
                Explorer les annonces
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reservations.slice(0, 5).map((r) => {
                const status = statusConfig[r.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <div key={r.id} className="px-6 py-4 flex items-center gap-4">
                    {r.listingImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.listingImage} alt={r.listingTitle}
                        className="w-14 h-14 object-cover rounded-xl shrink-0" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{r.listingTitle}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.startDate} → {r.endDate}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-gray-900 text-sm">{formatPrice(r.total)}</p>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${status.cls}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
