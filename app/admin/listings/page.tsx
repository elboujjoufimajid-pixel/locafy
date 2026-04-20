"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import type { Listing } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";
import { Plus, Pencil, Trash2, Search, BedDouble, Home, Car, CheckCircle, XCircle, Clock, ParkingCircle, Store } from "lucide-react";

const typeIcons = { apartment: BedDouble, house: Home, car: Car, parking: ParkingCircle, local: Store };
const typeColors = {
  apartment: "bg-blue-100 text-blue-700",
  house: "bg-purple-100 text-purple-700",
  car: "bg-orange-100 text-orange-700",
  parking: "bg-teal-100 text-teal-700",
  local: "bg-amber-100 text-amber-700",
};

type ListingWithStatus = Listing & { status?: string };

export default function AdminListings() {
  const router = useRouter();
  const [listings, setListings] = useState<ListingWithStatus[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    loadListings();
  }, [router]);

  async function loadListings() {
    const res = await fetch("/api/db/listings?admin=true");
    const data = await res.json();
    setListings(Array.isArray(data) ? data : []);
    setReady(true);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    await fetch(`/api/db/listings/${id}`, { method: "DELETE" });
    loadListings();
  }

  async function handleStatus(id: string, status: string) {
    await fetch(`/api/db/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadListings();
  }

  if (!ready) return null;

  const filtered = listings.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: listings.length,
    pending: listings.filter((l) => l.status === "pending").length,
    approved: listings.filter((l) => l.status === "approved").length,
    rejected: listings.filter((l) => l.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Annonces</h1>
              <p className="text-gray-500 text-sm mt-0.5">{listings.length} annonces au total</p>
            </div>
            <Link
              href="/admin/listings/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvelle annonce
            </Link>
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {([
              { key: "all", label: "Toutes" },
              { key: "pending", label: "⏳ En attente" },
              { key: "approved", label: "✅ Approuvées" },
              { key: "rejected", label: "❌ Refusées" },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  statusFilter === f.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                }`}
              >
                {f.label} ({counts[f.key]})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou ville..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-left">Annonce</th>
                    <th className="px-5 py-3 text-left">Ville</th>
                    <th className="px-5 py-3 text-left">Type</th>
                    <th className="px-5 py-3 text-right">Prix/jour</th>
                    <th className="px-5 py-3 text-center">Statut</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((l) => {
                    const Icon = typeIcons[l.type] ?? Home;
                    return (
                      <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={l.images[0]} alt={l.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            <span className="font-medium text-gray-800 max-w-[180px] truncate">{l.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-500">{l.city}</td>
                        <td className="px-5 py-3">
                          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${typeColors[l.type] ?? "bg-gray-100 text-gray-700"}`}>
                            <Icon className="w-3 h-3" />
                            {l.type === "apartment" ? "Appart." : l.type === "house" ? "Maison" : l.type === "car" ? "Voiture" : l.type === "parking" ? "Parking" : "Local"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-800">{formatPrice(l.pricePerDay)}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            l.status === "approved" ? "bg-green-100 text-green-700" :
                            l.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {l.status === "approved" ? "✅ Approuvée" : l.status === "rejected" ? "❌ Refusée" : "⏳ En attente"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-center gap-1">
                            {l.status !== "approved" && (
                              <button
                                onClick={() => handleStatus(l.id, "approved")}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approuver"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {l.status !== "rejected" && (
                              <button
                                onClick={() => handleStatus(l.id, "rejected")}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Refuser"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            {l.status === "approved" && (
                              <button
                                onClick={() => handleStatus(l.id, "pending")}
                                className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Mettre en attente"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                            )}
                            <Link
                              href={`/admin/listings/${l.id}/edit`}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(l.id, l.title)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                        Aucune annonce trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
