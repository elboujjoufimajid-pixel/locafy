"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { saveActivity } from "@/lib/adminStore";
import { CITIES } from "@/lib/data";
import type { Activity } from "@/lib/data";
import AdminSidebar from "@/components/AdminSidebar";
import { ArrowLeft, Save } from "lucide-react";

const emptyActivity: Omit<Activity, "id"> = {
  category: "outdoor",
  title: "",
  description: "",
  city: "Casablanca",
  address: "",
  pricePerPerson: 150,
  duration: "2h",
  images: [],
  included: [],
  rating: 4.5,
  reviewCount: 0,
  owner: { name: "", phone: "", avatar: "" },
  minPersons: 1,
  maxPersons: 10,
  available: true,
  idealFor: [],
};

export default function NewActivityPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<Omit<Activity, "id">>(emptyActivity);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  function set(key: string, value: string | boolean | number | string[]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleIdealFor(val: "family" | "couple" | "group" | "solo") {
    setForm((prev) => {
      const arr = prev.idealFor.includes(val)
        ? prev.idealFor.filter((v) => v !== val)
        : [...prev.idealFor, val];
      return { ...prev, idealFor: arr };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const id = "act_" + Date.now();
    saveActivity({ ...form, id } as Activity);
    router.push("/admin/activities");
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
                Nouvelle activité
              </h1>
              <p className="text-gray-500 text-sm">
                Ajouter une activité au catalogue
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
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className={inputClass}
                  placeholder="ex: Quad Aventure Oujda"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Catégorie *</label>
                  <select
                    value={form.category}
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
                    value={form.city}
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
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className={inputClass}
                  placeholder="Adresse ou point de départ"
                />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Décrivez l'activité..."
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
                    value={form.pricePerPerson}
                    onChange={(e) => set("pricePerPerson", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Réduction (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={form.deal || ""}
                    onChange={(e) =>
                      set("deal", e.target.value ? Number(e.target.value) : 0)
                    }
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>Durée</label>
                  <input
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    className={inputClass}
                    placeholder="ex: 2h, 3h30, journée"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Min. personnes</label>
                  <input
                    type="number"
                    min="1"
                    value={form.minPersons}
                    onChange={(e) => set("minPersons", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Max. personnes</label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxPersons}
                    onChange={(e) => set("maxPersons", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Spécifique restaurant */}
            {form.category === "restaurant" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-semibold text-gray-800">
                  Détails restaurant
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Cuisine</label>
                    <input
                      value={form.cuisine || ""}
                      onChange={(e) => set("cuisine", e.target.value)}
                      className={inputClass}
                      placeholder="ex: Marocaine, Italienne, Mix"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Horaires</label>
                    <input
                      value={form.schedule || ""}
                      onChange={(e) => set("schedule", e.target.value)}
                      className={inputClass}
                      placeholder="ex: 12:00 - 23:00"
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
                    value={form.owner.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        owner: { ...prev.owner, name: e.target.value },
                      }))
                    }
                    className={inputClass}
                    placeholder="Nom ou société"
                  />
                </div>
                <div>
                  <label className={labelClass}>Téléphone (sans 0)</label>
                  <input
                    value={form.owner.phone}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        owner: { ...prev.owner, phone: e.target.value },
                      }))
                    }
                    className={inputClass}
                    placeholder="ex: 661234567"
                  />
                </div>
              </div>
            </div>

            {/* Images & inclus */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800">
                Images & inclus
              </h2>
              <div>
                <label className={labelClass}>
                  URLs des images (une par ligne)
                </label>
                <textarea
                  value={form.images.join("\n")}
                  onChange={(e) =>
                    set(
                      "images",
                      e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  rows={3}
                  className={`${inputClass} resize-none font-mono text-xs`}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className={labelClass}>
                  Ce qui est inclus (séparés par virgules)
                </label>
                <input
                  value={form.included.join(", ")}
                  onChange={(e) =>
                    set(
                      "included",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  className={inputClass}
                  placeholder="Casque, Guide, Eau, Transfert..."
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
                        form.idealFor.includes(val)
                          ? "bg-blue-50 border-blue-400 text-blue-700 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={form.idealFor.includes(val)}
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
                    value={form.rating}
                    onChange={(e) => set("rating", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.available}
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
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {saving ? "Enregistrement..." : "Créer l'activité"}
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
