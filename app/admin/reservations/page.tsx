"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { getReservations, updateReservationStatus } from "@/lib/adminStore";
import type { Reservation, ReservationStatus } from "@/lib/adminStore";
import { formatPrice } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";
import { CheckCircle, Clock, XCircle, Phone } from "lucide-react";

const statusConfig = {
  confirmed: { label: "Confirmée", color: "bg-green-100 text-green-700", icon: CheckCircle },
  pending:   { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function AdminReservations() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<"all" | ReservationStatus>("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    setReservations(getReservations());
    setReady(true);
  }, [router]);

  if (!ready) return null;

  function changeStatus(id: string, status: ReservationStatus) {
    updateReservationStatus(id, status);
    setReservations(getReservations());
  }

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

  const counts = {
    all: reservations.length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    pending: reservations.filter((r) => r.status === "pending").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
            <p className="text-gray-500 text-sm mt-0.5">{reservations.length} réservations au total</p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  filter === f
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                }`}
              >
                {f === "all" ? "Toutes" : statusConfig[f].label} ({counts[f]})
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {filtered.map((r) => {
              const sc = statusConfig[r.status];
              const Icon = sc.icon;
              return (
                <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-gray-400">#{r.id}</span>
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sc.color}`}>
                          <Icon className="w-3 h-3" />
                          {sc.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${r.type === "activity" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {r.type === "activity" ? "🎯 Activité" : "🏠 Annonce"}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 truncate">{r.listingTitle}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          👤 <strong className="text-gray-700">{r.guest}</strong>
                        </span>
                        {r.guestEmail && (
                          <span className="text-xs text-gray-400">✉ {r.guestEmail}</span>
                        )}
                        <a href={`https://wa.me/212${r.phone.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:underline">
                          <Phone className="w-3.5 h-3.5" /> {r.phone}
                        </a>
                        <span>📅 {r.startDate} → {r.endDate}</span>
                        <span className="font-semibold text-gray-800">{formatPrice(r.total)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 shrink-0">
                      {r.status !== "confirmed" && (
                        <button
                          onClick={() => changeStatus(r.id, "confirmed")}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Confirmer
                        </button>
                      )}
                      {r.status !== "cancelled" && (
                        <button
                          onClick={() => changeStatus(r.id, "cancelled")}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-medium transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg font-medium">Aucune réservation</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
