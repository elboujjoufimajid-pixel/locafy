"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { getListings, getActivities, getReservations } from "@/lib/adminStore";
import { formatPrice } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";
import { Home, Zap, CalendarCheck, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const listings = getListings();
  const acts = getActivities();
  const reservations = getReservations();

  const confirmed = reservations.filter((r) => r.status === "confirmed");
  const pending = reservations.filter((r) => r.status === "pending");
  const revenue = confirmed.reduce((sum, r) => sum + r.total, 0);

  const statusConfig = {
    confirmed: { label: "Confirmée", color: "bg-green-100 text-green-700", icon: CheckCircle },
    pending:   { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    cancelled: { label: "Annulée", color: "bg-red-100 text-red-700", icon: XCircle },
  };

  const stats = [
    { label: "Annonces actives", value: listings.filter((l) => l.available).length, icon: Home, color: "bg-blue-50 text-blue-600" },
    { label: "Activités", value: acts.length, icon: Zap, color: "bg-purple-50 text-purple-600" },
    { label: "Réservations", value: reservations.length, icon: CalendarCheck, color: "bg-orange-50 text-orange-600" },
    { label: "Revenus (confirmés)", value: formatPrice(revenue), icon: TrendingUp, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-500 text-sm mt-1">Bienvenue dans le panneau d&apos;administration locafy.ma</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link href="/admin/listings/new" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 flex items-center gap-3 transition-colors">
              <Home className="w-5 h-5" />
              <span className="font-semibold text-sm">+ Nouvelle annonce</span>
            </Link>
            <Link href="/admin/listings" className="bg-white hover:bg-gray-50 text-gray-700 rounded-2xl p-4 flex items-center gap-3 border border-gray-200 transition-colors">
              <Home className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-sm">Gérer les annonces</span>
            </Link>
            <Link href="/admin/reservations" className="bg-white hover:bg-gray-50 text-gray-700 rounded-2xl p-4 flex items-center gap-3 border border-gray-200 transition-colors">
              <CalendarCheck className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-sm">Voir les réservations</span>
            </Link>
          </div>

          {/* Recent reservations */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Réservations récentes</h2>
              <Link href="/admin/reservations" className="text-sm text-blue-600 hover:underline">Voir tout</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                    <th className="px-6 py-3 text-left">Client</th>
                    <th className="px-6 py-3 text-left">Annonce</th>
                    <th className="px-6 py-3 text-left">Dates</th>
                    <th className="px-6 py-3 text-right">Total</th>
                    <th className="px-6 py-3 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reservations.slice(0, 5).map((r) => {
                    const sc = statusConfig[r.status];
                    const Icon = sc.icon;
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-800">{r.guest}</td>
                        <td className="px-6 py-3 text-gray-500 max-w-[180px] truncate">{r.listingTitle}</td>
                        <td className="px-6 py-3 text-gray-500">{r.startDate}</td>
                        <td className="px-6 py-3 text-right font-semibold text-gray-800">{formatPrice(r.total)}</td>
                        <td className="px-6 py-3">
                          <span className={`flex items-center justify-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>
                            <Icon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending alert */}
          {pending.length > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 flex items-center justify-between">
              <p className="text-yellow-800 text-sm font-medium">
                ⚠️ {pending.length} réservation{pending.length > 1 ? "s" : ""} en attente de confirmation
              </p>
              <Link href="/admin/reservations" className="text-yellow-700 text-sm font-semibold hover:underline">
                Traiter →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
