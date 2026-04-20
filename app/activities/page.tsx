"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import type { Activity } from "@/lib/data";
import { getOutings } from "@/lib/groupOutingsStore";
import { CITIES } from "@/lib/data";
import ActivityCard from "@/components/ActivityCard";
import GroupOutingCard from "@/components/GroupOutingCard";
import CreateOutingModal from "@/components/CreateOutingModal";
import { useT } from "@/lib/i18n";
import { SlidersHorizontal, Plus, Users } from "lucide-react";

type Category = "all" | "outdoor" | "restaurant" | "excursion";

function ActivitiesContent() {
  const searchParams = useSearchParams();
  const { t } = useT();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [outings, setOutings] = useState(() => getOutings());
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const a = t.activities;

  const category = (searchParams.get("category") || "all") as Category;
  const city = searchParams.get("city") || "all";

  useEffect(() => {
    const qs = new URLSearchParams();
    if (category !== "all") qs.set("category", category);
    if (city !== "all") qs.set("city", city);
    fetch(`/api/db/activities?${qs.toString()}`)
      .then((r) => r.json())
      .then((data) => setAllActivities(Array.isArray(data) ? data : []));
  }, [category, city]);

  const filtered = allActivities;

  const categories: { key: Category; label: string; emoji: string }[] = [
    { key: "all", label: a.all, emoji: "✨" },
    { key: "outdoor", label: a.outdoor, emoji: "🏄" },
    { key: "restaurant", label: a.restaurant, emoji: "🍽️" },
    { key: "excursion", label: a.excursion, emoji: "🗺️" },
  ];

  function buildHref(newCategory?: Category, newCity?: string) {
    const params = new URLSearchParams();
    if (newCategory && newCategory !== "all") params.set("category", newCategory);
    if (newCity && newCity !== "all") params.set("city", newCity);
    return `/activities${params.toString() ? `?${params.toString()}` : ""}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showCreateModal && (
        <CreateOutingModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => setOutings(getOutings())}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{a.pageTitle}</h1>
        <p className="text-gray-500">{a.pageSubtitle}</p>
      </div>

      {/* Sorties Groupe section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sorties Groupe</h2>
              <p className="text-sm text-gray-500">Rejoins une sortie ou organise la tienne</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer une sortie
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {outings.map((outing) => (
            <GroupOutingCard
              key={outing.id}
              outing={outing}
              onUpdate={() => setOutings(getOutings())}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 mb-8" />

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <a
            key={cat.key}
            href={buildHref(cat.key, city !== "all" ? city : undefined)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              category === cat.key
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-700"
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </a>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-blue-700" />
              <h2 className="font-semibold text-gray-900">{t.filters.city}</h2>
            </div>
            <select
              value={city}
              onChange={(e) => {
                const newCity = e.target.value;
                window.location.href = buildHref(category !== "all" ? category : undefined, newCity !== "all" ? newCity : undefined);
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
            >
              <option value="all">{t.filters.allCities}</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} {filtered.length > 1 ? a.foundPlural : a.found}
            {city !== "all" ? ` ${a.in} ${city}` : ` ${a.inOriental}`}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🎯</div>
              <p className="font-medium text-lg text-gray-600">{a.noResults}</p>
              <p className="text-sm mt-2">{a.noResultsHint}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-gray-400">Chargement...</div>}>
      <ActivitiesContent />
    </Suspense>
  );
}
