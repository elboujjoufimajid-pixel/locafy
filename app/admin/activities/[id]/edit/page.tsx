"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { CITIES } from "@/lib/data";
import type { Activity } from "@/lib/data";
import AdminSidebar from "@/components/AdminSidebar";
import ImageUploader from "@/components/ImageUploader";
import { ArrowLeft, Save } from "lucide-react";

export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    fetch(`/api/db/activities/${params.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (!data) router.push("/admin/activities"); else setActivity(data); });
  }, [router, params.id]);

  if (!activity) return null;

  function set(key: string, value: string | boolean | number | string[]) {
    setActivity((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  function toggleIdealFor(val: "family" | "couple" | "group" | "solo") {
    setActivity((prev) => {
      if (!prev) return prev;
      const arr = prev.idealFor.includes(val)
        ? prev.idealFor.filter((v) => v !== val)
        : [...prev.idealFor, val];
      return { ...prev, idealFor: arr };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activity) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    await fetch(`/api/db/activities/${activity.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    });
    setSaved(true);
    setSaving(false);
    setTimeout(() => router.push("/admin/activities"), 1200);
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition bg-white";
  const labelClass =
    "block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide";

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/admin/activities"
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Modifier l&apos;activité
              </h1>
              <p className="text-gray-500 text-sm truncate max-w-xs">
                {activity.title}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Infos générales */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800">
                Informations générales
              </h2>
              <div>
                <label className={labelClass}>Titre *</label>
                <input
                  required
                  value={activity.title}
                  onChange={(e) => set("title", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Catégorie *</label>
                  <select
                    value={activity.category}
                    onChange={(e) => set("category", e.target.value)}
                    className={inputClass}
                  >
                    <option value="outdoor">🏄 Outdoor / Sport</option>
                    <option value="restaurant">🍽️ Restaurant</option>
                    <option value="excursion">🗺️ Excursion</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ville *</label>
                  <select
                    value={activity.city}
                    onChange={(e) => set("city", e.target.value)}
                    className={inputClass}
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Adresse</label>
                <input
                  value={activity.address}
                  onChange={(e) => set("address", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  required
                  value={activity.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Prix & logistique */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800">Prix & logistique</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Prix / pers. (MAD) *</label>
                  <input
                    required
                    type="number"
                    value={activity.pricePerPerson}
                    onChange={(e) =>
                      set("pricePerPerson", Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Réduction (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={activity.deal || ""}
                    onChange={(e) =>
                      set("deal", e.target.value ? Number(e.target.value) : 0)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Durée</label>
                  <input
                    value={activity.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Min. personnes</label>
                  <input
                    type="number"
                    min="1"
                    value={activity.minPersons}
                    onChange={(e) => set("minPersons", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Max. personnes</label>
                  <input
                    type="number"
                    min="1"
                    value={activity.maxPersons}
                    onChange={(e) => set("maxPersons", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Spécifique restaurant */}
            {activity.category === "restaurant" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-semibold text-gray-800">
                  Détails restaurant
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Cuisine</label>
                    <input
                      value={activity.cuisine || ""}
                      onChange={(e) => set("cuisine", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Horaires</label>
                    <input
                      value={activity.schedule || ""}
                      onChange={(e) => set("schedule", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Prestataire */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800">Prestataire</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nom du prestataire</label>
                  <input
                    value={activity.owner.name}
                    onChange={(e) =>
                      setActivity((prev) =>
                        prev
                          ? { ...prev, owner: { ...prev.owner, name: e.target.value } }
                          : prev
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Téléphone (sans 0)</label>
                  <input
                    value={activity.owner.phone}
                    onChange={(e) =>
                      setActivity((prev) =>
                        prev
                          ? { ...prev, owner: { ...prev.owner, phone: e.target.value } }
                          : prev
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Images & inclus */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800">Images & inclus</h2>
              <div>
                <label className={labelClass}>Photos</label>
                <ImageUploader images={activity.images} onChange={(imgs) => setActivity((prev) => prev ? { ...prev, images: imgs } : prev)} />
              </div>
              <div>
                <label className={labelClass}>
                  Ce qui est inclus (séparés par virgules)
                </label>
                <input
                  value={activity.included.join(", ")}
                  onChange={(e) =>
                    setActivity((prev) =>
                      prev
                        ? {
                            ...prev,
                            included: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }
                        : prev
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Idéal pour</label>
                <div className="flex gap-3 flex-wrap mt-1">
                  {(
                    [
                      { val: "family", label: "👨‍👩‍👧‍👦 Famille" },
                      { val: "couple", label: "💑 Couple" },
                      { val: "group", label: "👥 Groupe" },
                      { val: "solo", label: "🧍 Solo" },
                    ] as { val: "family" | "couple" | "group" | "solo"; label: string }[]
                  ).map(({ val, label }) => (
                    <label
                      key={val}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors ${
                        activity.idealFor.includes(val)
                          ? "bg-blue-50 border-blue-400 text-blue-700 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={activity.idealFor.includes(val)}
                        onChange={() => toggleIdealFor(val)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Note (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={activity.rating}
                    onChange={(e) => set("rating", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activity.available}
                      onChange={(e) => set("available", e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Disponible
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || saved}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {saved
                  ? "✓ Enregistré !"
                  : saving
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>
              <Link
                href="/admin/activities"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
