"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import AdminSidebar from "@/components/AdminSidebar";
import Link from "next/link";
import {
  Home, Users, CalendarCheck, TrendingUp, Clock, CheckCircle,
  XCircle, AlertTriangle, ArrowUpRight, Plus, Eye,
} from "lucide-react";

interface Stats {
  listings: { total: number; approved: number; pending: number; rejected: number };
  members: { total: number; owners: number; clients: number; thisMonth: number };
  reservations: { total: number; confirmed: number; pending: number; cancelled: number; thisMonth: number };
  revenue: { total: number; thisMonth: number };
  recentReservations: {
    id: string; listingTitle: string; guest: string; guestEmail: string;
    startDate: string; endDate: string; total: number; status: string;
  }[];
}

function fmt(n: number) {
  return n.toLocaleString("fr-MA") + " MAD";
}

const statusStyle: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};
const statusLabel: Record<string, string> = {
  confirmed: "Confirmée", pending: "En attente", cancelled: "Annulée",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    fetch("/api/db/stats").then((r) => r.json()).then(setStats);
  }, [router]);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="md:ml-56 pt-14 md:pt-0 flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  const kpis = [
    {
      label: "Annonces approuvées",
      value: stats.listings.approved,
      sub: `${stats.listings.pending} en attente`,
      icon: Home,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/admin/listings",
    },
    {
      label: "Membres inscrits",
      value: stats.members.total,
      sub: `+${stats.members.thisMonth} ce mois`,
      icon: Users,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      href: "/admin/members",
    },
    {
      label: "Réservations",
      value: stats.reservations.total,
      sub: `${stats.reservations.confirmed} confirmées`,
      icon: CalendarCheck,
      color: "bg-orange-50",
      iconColor: "text-orange-500",
      href: "/admin/reservations",
    },
    {
      label: "Revenus confirmés",
      value: fmt(stats.revenue.total),
      sub: `${fmt(stats.revenue.thisMonth)} ce mois`,
      icon: TrendingUp,
      color: "bg-green-50",
      iconColor: "text-green-600",
      href: "/admin/reservations",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-6xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {new Date().toLocaleDateString("fr-MA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <Link
              href="/admin/listings/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvelle annonce
            </Link>
          </div>

          {/* Alerts */}
          {(stats.listings.pending > 0 || stats.reservations.pending > 0) && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {stats.listings.pending > 0 && (
                <Link href="/admin/listings" className="flex-1 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 hover:bg-amber-100 transition-colors">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-800">
                      {stats.listings.pending} annonce{stats.listings.pending > 1 ? "s" : ""} en attente d&apos;approbation
                    </p>
                    <p className="text-xs text-amber-600">Cliquez pour approuver ou refuser</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-amber-500" />
                </Link>
              )}
              {stats.reservations.pending > 0 && (
                <Link href="/admin/reservations" className="flex-1 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-800">
                      {stats.reservations.pending} réservation{stats.reservations.pending > 1 ? "s" : ""} en attente
                    </p>
                    <p className="text-xs text-blue-600">Cliquez pour confirmer ou annuler</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-blue-500" />
                </Link>
              )}
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <Link key={k.label} href={k.href} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${k.color}`}>
                    <Icon className={`w-5 h-5 ${k.iconColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 leading-none">{k.value}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{k.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </Link>
              );
            })}
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Recent reservations */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Réservations récentes</h2>
                <Link href="/admin/reservations" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Tout voir <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {stats.recentReservations.length === 0 && (
                  <p className="px-6 py-10 text-center text-gray-400 text-sm">Aucune réservation pour l&apos;instant</p>
                )}
                {stats.recentReservations.map((r) => (
                  <div key={r.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                      {r.guest?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{r.listingTitle}</p>
                      <p className="text-xs text-gray-400">{r.guest} · {r.startDate}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-gray-800 text-sm">{r.total?.toLocaleString("fr-MA")} MAD</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[r.status] || "bg-gray-100 text-gray-600"}`}>
                        {statusLabel[r.status] || r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — quick stats */}
            <div className="flex flex-col gap-4">

              {/* Reservation breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Réservations</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" /> Confirmées
                    </div>
                    <span className="font-bold text-gray-900">{stats.reservations.confirmed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-yellow-500" /> En attente
                    </div>
                    <span className="font-bold text-gray-900">{stats.reservations.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <XCircle className="w-4 h-4 text-red-400" /> Annulées
                    </div>
                    <span className="font-bold text-gray-900">{stats.reservations.cancelled}</span>
                  </div>
                </div>
              </div>

              {/* Members breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Membres</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">🔑 Propriétaires</span>
                    <span className="font-bold text-gray-900">{stats.members.owners}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">🏠 Locataires</span>
                    <span className="font-bold text-gray-900">{stats.members.clients}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">📅 Ce mois</span>
                    <span className="font-bold text-green-600">+{stats.members.thisMonth}</span>
                  </div>
                </div>
              </div>

              {/* Listings breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Annonces</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">✅ Approuvées</span>
                    <span className="font-bold text-gray-900">{stats.listings.approved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">⏳ En attente</span>
                    <span className="font-bold text-amber-600">{stats.listings.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">❌ Refusées</span>
                    <span className="font-bold text-gray-900">{stats.listings.rejected}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: "/admin/listings", label: "Gérer annonces", icon: Home, color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
              { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck, color: "text-orange-600 bg-orange-50 hover:bg-orange-100" },
              { href: "/admin/members", label: "Membres", icon: Users, color: "text-purple-600 bg-purple-50 hover:bg-purple-100" },
              { href: "/listings", label: "Voir le site", icon: Eye, color: "text-gray-600 bg-gray-50 hover:bg-gray-100", external: true },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  target={a.external ? "_blank" : undefined}
                  className={`flex items-center gap-3 p-4 rounded-xl font-medium text-sm transition-colors border border-transparent ${a.color}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {a.label}
                </Link>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
