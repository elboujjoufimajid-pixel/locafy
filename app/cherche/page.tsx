"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Phone, Plus, Search } from "lucide-react";
import { getDemands } from "@/lib/demandStore";
import type { RentalDemand } from "@/lib/demandStore";

const typeLabels: Record<RentalDemand["type"], string> = {
  apartment: "🏢 Appartement",
  house: "🏡 Maison / Villa",
  car: "🚗 Voiture",
  parking: "🅿️ Parking / Garage",
  local: "🏪 Local commercial",
};

const typeColors: Record<RentalDemand["type"], string> = {
  apartment: "bg-blue-100 text-blue-700",
  house: "bg-violet-100 text-violet-700",
  car: "bg-orange-100 text-orange-700",
  parking: "bg-teal-100 text-teal-700",
  local: "bg-amber-100 text-amber-700",
};

export default function ChercheListPage() {
  const [demands, setDemands] = useState<RentalDemand[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setDemands(getDemands());
  }, []);

  const types = [
    { value: "all", label: "Tout" },
    { value: "apartment", label: "Appartement" },
    { value: "house", label: "Maison" },
    { value: "car", label: "Voiture" },
    { value: "parking", label: "Parking" },
    { value: "local", label: "Local" },
  ];

  const filtered = filter === "all" ? demands : demands.filter((d) => d.type === filter);

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Il y a moins d'1h";
    if (h < 24) return `Il y a ${h}h`;
    const d = Math.floor(h / 24);
    return `Il y a ${d} jour${d > 1 ? "s" : ""}`;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📋 Demandes de location</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} demande{filtered.length !== 1 ? "s" : ""} en attente
          </p>
        </div>
        <Link
          href="/cherche/new"
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Je cherche
        </Link>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <strong>Vous êtes propriétaire ?</strong> Parcourez les demandes et contactez directement les locataires qui correspondent à votre bien.
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              filter === t.value
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium text-lg text-gray-600">Aucune demande pour le moment</p>
          <p className="text-sm mt-2 mb-6">Soyez le premier à publier une demande</p>
          <Link
            href="/cherche/new"
            className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Publier ma demande
          </Link>
        </div>
      )}

      {/* Demand cards */}
      <div className="flex flex-col gap-4">
        {filtered.map((demand) => (
          <div key={demand.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[demand.type]}`}>
                    {typeLabels[demand.type]}
                  </span>
                  <span className="text-xs text-gray-400">{timeAgo(demand.createdAt)}</span>
                </div>

                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  Cherche {typeLabels[demand.type].split(" ").slice(1).join(" ")} à {demand.city}
                </h3>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{demand.city}</span>
                  {demand.duration && <span className="ml-2 text-gray-400">· {demand.duration}</span>}
                </div>

                {demand.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{demand.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Budget :</span>
                    <span className="font-semibold text-blue-700">
                      {demand.budgetMin > 0 ? `${demand.budgetMin.toLocaleString()} — ` : ""}
                      {demand.budgetMax.toLocaleString()} MAD
                    </span>
                    <span className="text-gray-400">/ {demand.budgetUnit === "month" ? "mois" : "jour"}</span>
                  </div>
                  {demand.bedrooms && demand.type !== "car" && demand.type !== "parking" && (
                    <span className="text-gray-500">{demand.bedrooms} ch.</span>
                  )}
                </div>
              </div>

              {/* Contact */}
              <a
                href={`https://wa.me/212${demand.contactPhone.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-600 transition-colors shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                Contacter
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
