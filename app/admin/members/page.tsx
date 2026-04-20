"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import AdminSidebar from "@/components/AdminSidebar";
import { Users, Crown, Search, Download } from "lucide-react";

interface Member {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  joinedAt: string;
}

export default function AdminMembers() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<"all" | "client" | "owner">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    fetch("/api/db/members")
      .then((r) => r.json())
      .then((data) => { setMembers(Array.isArray(data) ? data : []); setReady(true); });
  }, [router]);

  if (!ready) return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar />
      <main className="md:ml-60 pt-14 md:pt-0 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </main>
    </div>
  );

  const filtered = members
    .filter((m) => filter === "all" || m.role === filter)
    .filter((m) =>
      !search ||
      `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(search.toLowerCase())
    );

  const owners = members.filter((m) => m.role === "owner").length;
  const clients = members.filter((m) => m.role === "client").length;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar />
      <main className="md:ml-60 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-6xl">

          {/* Header */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Membres</h1>
              <p className="text-gray-500 text-sm mt-1">{members.length} membres inscrits</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total", value: members.length, color: "bg-gray-900 text-white" },
              { label: "Propriétaires", value: owners, color: "bg-purple-600 text-white" },
              { label: "Locataires", value: clients, color: "bg-blue-600 text-white" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
                <p className="text-3xl font-bold opacity-90">{s.value}</p>
                <p className="text-sm opacity-70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {[
                { key: "all", label: "Tous" },
                { key: "owner", label: "🔑 Propriétaires" },
                { key: "client", label: "🏠 Locataires" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as typeof filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f.key
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un membre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Membre</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Téléphone</th>
                  <th className="px-5 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Rôle</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Inscrit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const initials = `${m.firstName?.[0] || ""}${m.lastName?.[0] || ""}`.toUpperCase() || "?";
                  const colors = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-green-100 text-green-700", "bg-orange-100 text-orange-700", "bg-pink-100 text-pink-700"];
                  const color = colors[i % colors.length];
                  return (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${color}`}>
                            {initials}
                          </div>
                          <span className="font-medium text-gray-900">{m.firstName} {m.lastName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{m.email}</td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {m.phone ? (
                          <a
                            href={`https://wa.me/212${m.phone.replace(/^0/, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 font-medium hover:underline"
                          >
                            {m.phone}
                          </a>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {m.role === "owner" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                            <Crown className="w-3 h-3" /> Propriétaire
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            <Users className="w-3 h-3" /> Locataire
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-gray-400 text-xs">
                        {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">Aucun membre trouvé</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
