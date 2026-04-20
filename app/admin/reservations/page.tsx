"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { formatPrice } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";
import { CheckCircle, Clock, XCircle, MessageCircle, Mail } from "lucide-react";

type ReservationStatus = "confirmed" | "pending" | "cancelled";
interface Reservation {
  id: string;
  listingTitle: string;
  listingCity?: string;
  type: string;
  guest: string;
  guestEmail?: string;
  phone: string;
  startDate: string;
  endDate: string;
  total: number;
  status: ReservationStatus;
}

const statusCfg = {
  confirmed: { label: "Confirmée", bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  pending:   { label: "En attente", bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500" },
  cancelled: { label: "Annulée", bg: "bg-red-50 text-red-600 border-red-100", dot: "bg-red-400" },
};

export default function AdminReservations() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<"all" | ReservationStatus>("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    load();
  }, [router]);

  async function load() {
    const res = await fetch("/api/db/reservations");
    const data = await res.json();
    setReservations(Array.isArray(data) ? data : []);
    setReady(true);
  }

  async function changeStatus(id: string, status: ReservationStatus) {
    await fetch(`/api/db/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (status === "confirmed") {
      const r = reservations.find((x) => x.id === id);
      if (r?.guestEmail) {
        fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestEmail: r.guestEmail,
            guestName: r.guest,
            reservationId: r.id,
            listingTitle: r.listingTitle,
            listingCity: r.listingCity,
            startDate: r.startDate,
            endDate: r.endDate,
            total: r.total,
          }),
        });
      }
    }
    load();
  }

  if (!ready) return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar />
      <main className="md:ml-60 pt-14 md:pt-0 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </main>
    </div>
  );

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);
  const counts = {
    all: reservations.length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    pending: reservations.filter((r) => r.status === "pending").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };
  const totalRevenue = reservations
    .filter((r) => r.status === "confirmed")
    .reduce((s, r) => s + r.total, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar />
      <main className="md:ml-60 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-6xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
            <p className="text-gray-500 text-sm mt-1">{reservations.length} réservations au total</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total", value: counts.all, color: "text-gray-900", bg: "bg-white" },
              { label: "Confirmées", value: counts.confirmed, color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "En attente", value: counts.pending, color: "text-amber-700", bg: "bg-amber-50" },
              { label: "Revenus", value: `${totalRevenue.toLocaleString("fr-MA")} MAD`, color: "text-blue-700", bg: "bg-blue-50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-6">
            {([
              { key: "all", label: "Toutes" },
              { key: "pending", label: "En attente" },
              { key: "confirmed", label: "Confirmées" },
              { key: "cancelled", label: "Annulées" },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {f.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-md ${filter === f.key ? "bg-white/20" : "bg-gray-100"}`}>
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {filtered.map((r) => {
              const sc = statusCfg[r.status];
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex items-stretch">
                    {/* Left accent */}
                    <div className={`w-1 shrink-0 ${sc.dot}`} />

                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          {/* ID + status */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">#{r.id}</span>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {sc.label}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              {r.type === "activity" ? "🎯 Activité" : "🏠 Logement"}
                            </span>
                          </div>

                          {/* Title */}
                          <p className="font-semibold text-gray-900 text-base truncate mb-3">{r.listingTitle}</p>

                          {/* Details grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
                            <div>
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Client</p>
                              <p className="text-sm font-medium text-gray-800">{r.guest}</p>
                            </div>
                            {r.guestEmail && (
                              <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                                <p className="text-xs text-gray-500 truncate">{r.guestEmail}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Dates</p>
                              <p className="text-sm text-gray-700">{r.startDate} → {r.endDate}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Montant</p>
                              <p className="text-sm font-bold text-gray-900">{formatPrice(r.total)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <a
                            href={`https://wa.me/212${r.phone?.replace(/^0/, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl font-medium transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                          {r.guestEmail && (
                            <a
                              href={`mailto:${r.guestEmail}`}
                              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-xl font-medium transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" /> Email
                            </a>
                          )}
                          {r.status !== "confirmed" && (
                            <button
                              onClick={() => changeStatus(r.id, "confirmed")}
                              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Confirmer
                            </button>
                          )}
                          {r.status === "pending" && (
                            <button
                              onClick={() => changeStatus(r.id, "cancelled")}
                              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-white hover:bg-red-50 text-red-500 border border-red-200 rounded-xl font-medium transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Annuler
                            </button>
                          )}
                          {r.status === "confirmed" && (
                            <button
                              onClick={() => changeStatus(r.id, "cancelled")}
                              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-white hover:bg-red-50 text-red-500 border border-red-200 rounded-xl font-medium transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
                <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">Aucune réservation</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
