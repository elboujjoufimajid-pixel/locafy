"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { getActivities, deleteActivity } from "@/lib/adminStore";
import type { Activity } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";
import { Plus, Trash2, Search, Pencil } from "lucide-react";

const catColors = {
  outdoor: "bg-green-100 text-green-700",
  restaurant: "bg-orange-100 text-orange-700",
  excursion: "bg-purple-100 text-purple-700",
};
const catEmojis = { outdoor: "🏄", restaurant: "🍽️", excursion: "🗺️" };

export default function AdminActivities() {
  const router = useRouter();
  const [acts, setActs] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    setActs(getActivities());
    setReady(true);
  }, [router]);

  if (!ready) return null;

  function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    deleteActivity(id);
    setActs(getActivities());
  }

  const filtered = acts.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Activités</h1>
              <p className="text-gray-500 text-sm mt-0.5">{acts.length} activités au total</p>
            </div>
            <Link
              href="/admin/activities/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvelle activité
            </Link>
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
                    <th className="px-5 py-3 text-left">Activité</th>
                    <th className="px-5 py-3 text-left">Ville</th>
                    <th className="px-5 py-3 text-left">Catégorie</th>
                    <th className="px-5 py-3 text-left">Durée</th>
                    <th className="px-5 py-3 text-right">Prix/pers.</th>
                    <th className="px-5 py-3 text-center">Note</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={a.images[0]} alt={a.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <span className="font-medium text-gray-800 max-w-[180px] truncate">{a.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{a.city}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColors[a.category]}`}>
                          {catEmojis[a.category]} {a.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{a.duration}</td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-800">{formatPrice(a.pricePerPerson)}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-lg">⭐ {a.rating}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/admin/activities/${a.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(a.id, a.title)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-gray-400">Aucune activité trouvée</td>
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
