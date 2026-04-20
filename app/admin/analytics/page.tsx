"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import AdminSidebar from "@/components/AdminSidebar";
import { Users, Eye, Smartphone, Monitor, MapPin, Clock, RefreshCw } from "lucide-react";

interface AnalyticsData {
  today: number;
  week: number;
  month: number;
  topPages: { page: string; views: number }[];
  cities: { city: string; users: number }[];
  countries: { country: string; users: number }[];
  devices: { mobile: number; desktop: number };
  days: { label: string; count: number }[];
  recent: { page: string; city: string; country: string; device: string; visitedAt: string }[];
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Accueil",
  "/listings": "Annonces",
  "/activities": "Activités",
  "/dashboard": "Dashboard",
  "/auth/login": "Connexion",
  "/auth/register": "Inscription",
  "/checkout": "Checkout",
  "/contact": "Contact",
  "/about": "À propos",
};

function pageLabel(page: string) {
  if (PAGE_LABELS[page]) return PAGE_LABELS[page];
  if (page.startsWith("/listings/")) return "Détail annonce";
  if (page.startsWith("/activities/")) return "Détail activité";
  return page;
}

export default function AdminAnalytics() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  function load() {
    setLoading(true);
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); setLastRefresh(new Date()); });
  }

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !data) return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="md:ml-60 pt-14 md:pt-0 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </main>
    </div>
  );

  if (!data) return null;

  const maxDay = Math.max(...data.days.map((d) => d.count), 1);
  const maxPage = Math.max(...data.topPages.map((p) => p.views), 1);
  const maxCity = Math.max(...data.cities.map((c) => c.users), 1);
  const totalDevices = data.devices.mobile + data.devices.desktop || 1;
  const mobilePct = Math.round((data.devices.mobile / totalDevices) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="md:ml-60 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-6xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visiteurs</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Mis à jour à {lastRefresh.toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <button
              onClick={load}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Aujourd'hui", value: data.today, icon: Clock, color: "bg-green-50 text-green-600", border: "border-green-100" },
              { label: "Cette semaine", value: data.week, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
              { label: "Ce mois", value: data.month, icon: Eye, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
            ].map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className={`bg-white rounded-2xl p-5 shadow-sm border ${k.border}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{k.value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{k.label}</p>
                </div>
              );
            })}
          </div>

          {/* Chart 7 days */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-5">Visiteurs — 7 derniers jours</h2>
            <div className="flex items-end gap-2 h-32">
              {data.days.map((d, i) => {
                const pct = Math.round((d.count / maxDay) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-gray-700">{d.count || ""}</span>
                    <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: "80px" }}>
                      <div
                        className="w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 capitalize">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Top pages */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Pages les plus visitées</h2>
              {data.topPages.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucune donnée encore</p>
              ) : (
                <div className="space-y-3">
                  {data.topPages.map((p, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">{pageLabel(p.page)}</span>
                        <span className="text-sm font-semibold text-gray-900">{p.views}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round((p.views / maxPage) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cities */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-400" />
                <h2 className="font-semibold text-gray-900">Villes</h2>
              </div>
              {data.cities.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucune donnée encore</p>
              ) : (
                <div className="space-y-3">
                  {data.cities.map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">{c.city || "Inconnue"}</span>
                        <span className="text-sm font-semibold text-gray-900">{c.users}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.round((c.users / maxCity) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Devices */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Appareils</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">Mobile</span>
                      <span className="text-sm font-bold text-gray-900">{mobilePct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${mobilePct}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">Desktop</span>
                      <span className="text-sm font-bold text-gray-900">{100 - mobilePct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: `${100 - mobilePct}%` }} />
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-50 flex justify-between text-xs text-gray-400">
                  <span>{data.devices.mobile} mobile</span>
                  <span>{data.devices.desktop} desktop</span>
                </div>
              </div>
            </div>

            {/* Countries */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
              <h2 className="font-semibold text-gray-900 mb-4">Pays</h2>
              {data.countries.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucune donnée encore</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {data.countries.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <span className="text-sm text-gray-700">{c.country}</span>
                      <span className="text-sm font-semibold text-gray-900">{c.users} visiteurs</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Recent visits */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Dernières visites</h2>
            </div>
            {data.recent.length === 0 ? (
              <p className="px-6 py-8 text-gray-400 text-sm text-center">Aucune visite encore — le tracking démarre dès qu&apos;un visiteur arrive sur le site.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {data.recent.map((v, i) => (
                  <div key={i} className="px-6 py-3 flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      {v.device === "Mobile" ? <Smartphone className="w-4 h-4 text-gray-400" /> : <Monitor className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{pageLabel(v.page)}</p>
                      <p className="text-xs text-gray-400">{v.city || "?"}, {v.country || "?"}</p>
                    </div>
                    <p className="text-xs text-gray-400 shrink-0">
                      {new Date(v.visitedAt).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
