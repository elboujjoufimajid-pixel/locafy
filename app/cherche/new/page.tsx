"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CITIES } from "@/lib/data";
import { saveDemand } from "@/lib/demandStore";
import { getCurrentUser } from "@/lib/userAuth";

const typeOptions = [
  { value: "apartment", label: "Appartement", icon: "🏢" },
  { value: "house", label: "Maison / Villa", icon: "🏡" },
  { value: "car", label: "Voiture", icon: "🚗" },
  { value: "parking", label: "Parking / Garage", icon: "🅿️" },
  { value: "local", label: "Local commercial", icon: "🏪" },
];

const durationOptions = [
  "1 semaine",
  "1 mois",
  "3 mois",
  "6 mois",
  "1 an",
  "Court terme",
  "Long terme",
];

export default function NewDemandPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    type: "",
    city: "",
    budgetMin: "",
    budgetMax: "",
    budgetUnit: "month" as "day" | "month",
    duration: "",
    bedrooms: "",
    description: "",
    contactName: "",
    contactPhone: "",
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const user = getCurrentUser();

    saveDemand({
      type: form.type as "apartment" | "house" | "car" | "parking" | "local",
      city: form.city,
      budgetMin: form.budgetMin ? Number(form.budgetMin) : 0,
      budgetMax: Number(form.budgetMax),
      budgetUnit: form.budgetUnit,
      duration: form.duration,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      description: form.description,
      contactName: user ? `${user.firstName} ${user.lastName}` : form.contactName,
      contactPhone: user?.phone || form.contactPhone,
    });

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition";

  const user = getCurrentUser();

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Demande publiée !</h2>
        <p className="text-gray-500 text-sm mb-6">
          Les propriétaires peuvent maintenant vous contacter directement.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push("/cherche")}
            className="bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            Voir les demandes
          </button>
          <button
            onClick={() => { setSubmitted(false); setForm({ type: "", city: "", budgetMin: "", budgetMax: "", budgetUnit: "month", duration: "", bedrooms: "", description: "", contactName: "", contactPhone: "" }); }}
            className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Nouvelle demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📋 Publier une demande</h1>
        <p className="text-gray-500 text-sm mt-1">
          Décrivez ce que vous cherchez — les propriétaires vous contacteront directement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Type de bien</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {typeOptions.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => set("type", t.value)}
                className={`p-4 rounded-xl border-2 text-center transition-colors ${
                  form.type === t.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-1">{t.icon}</div>
                <div className="text-sm font-medium text-gray-700">{t.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Location + Budget */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Localisation & Budget</h2>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Ville *</label>
            <select value={form.city} onChange={(e) => set("city", e.target.value)} required className={inputClass}>
              <option value="">Choisir une ville</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Budget par</label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, budgetUnit: "day" }))}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${form.budgetUnit === "day" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}
              >
                Jour
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, budgetUnit: "month" }))}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${form.budgetUnit === "month" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}
              >
                Mois
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Budget min (MAD)</label>
                <input
                  type="number"
                  value={form.budgetMin}
                  onChange={(e) => set("budgetMin", e.target.value)}
                  placeholder="1000"
                  min="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Budget max (MAD) *</label>
                <input
                  type="number"
                  value={form.budgetMax}
                  onChange={(e) => set("budgetMax", e.target.value)}
                  placeholder="5000"
                  min="1"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Durée souhaitée</label>
              <select value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputClass}>
                <option value="">Non précisé</option>
                {durationOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {(form.type === "apartment" || form.type === "house") && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Chambres minimum</label>
                <input
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                  placeholder="2"
                  min="1"
                  className={inputClass}
                />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Détails supplémentaires</h2>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Décrivez vos besoins : quartier préféré, équipements souhaités, situation familiale..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Contact — only if not logged in */}
        {!user && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Vos coordonnées</h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom complet *</label>
              <input
                value={form.contactName}
                onChange={(e) => set("contactName", e.target.value)}
                placeholder="Mohamed Alaoui"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Téléphone (WhatsApp) *</label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => set("contactPhone", e.target.value)}
                placeholder="0612345678"
                required
                className={inputClass}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !form.type || !form.city || !form.budgetMax || (!user && (!form.contactName || !form.contactPhone))}
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Publication...</>
          ) : (
            "📋 Publier ma demande"
          )}
        </button>
      </form>
    </div>
  );
}
