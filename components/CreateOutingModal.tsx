"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { CITIES, type OutingCategory } from "@/lib/data";
import { saveOuting } from "@/lib/groupOutingsStore";
import { getCurrentUser } from "@/lib/userAuth";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const categories: { value: OutingCategory; label: string; emoji: string }[] = [
  { value: "plage",     label: "Plage",      emoji: "🏖️" },
  { value: "randonnee", label: "Randonnée",  emoji: "🥾" },
  { value: "resto",     label: "Resto",      emoji: "🍕" },
  { value: "roadtrip",  label: "Road Trip",  emoji: "🚗" },
  { value: "gaming",    label: "Gaming",     emoji: "🎮" },
  { value: "sport",     label: "Sport",      emoji: "⚽" },
  { value: "autre",     label: "Autre",      emoji: "✨" },
];

const categoryImages: Record<OutingCategory, string> = {
  plage:     "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  randonnee: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
  resto:     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  roadtrip:  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
  gaming:    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
  sport:     "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
  autre:     "https://images.unsplash.com/photo-1533470192478-9897d90d5461?w=800",
};

export default function CreateOutingModal({ onClose, onCreated }: Props) {
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "" as OutingCategory | "",
    city: "",
    meetingPoint: "",
    date: "",
    time: "",
    maxParticipants: "10",
    price: "0",
    tags: "",
    organizerName: user ? `${user.firstName} ${user.lastName}` : "",
    organizerPhone: user?.phone || "",
  });

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-600 transition";

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const cat = form.category as OutingCategory;
    const outing = {
      id: `go_${Date.now()}`,
      title: form.title,
      description: form.description,
      category: cat,
      city: form.city,
      meetingPoint: form.meetingPoint,
      date: form.date,
      time: form.time || "12:00",
      maxParticipants: Number(form.maxParticipants),
      participants: [],
      organizer: {
        name: form.organizerName || "Anonyme",
        avatar: (form.organizerName[0] || "A").toUpperCase(),
        phone: form.organizerPhone || undefined,
      },
      image: categoryImages[cat],
      price: Number(form.price),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    saveOuting(outing);
    setLoading(false);
    onCreated();
    onClose();
    // small delay so user sees the new outing appear
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  }

  // time optional — default 12:00 if not filled (Windows time picker bug)
  const isValid = form.title && form.category && form.city && form.meetingPoint && form.date;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-gray-900">Créer une sortie groupe</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Type de sortie *</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set("category", c.value)}
                  className={`p-2.5 rounded-xl border-2 text-center transition-colors text-xs font-medium ${form.category === c.value ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  <div className="text-xl mb-0.5">{c.emoji}</div>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Titre *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Plage de Saidia — Sortie weekend" required className={inputClass} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Décrivez votre sortie..." className={`${inputClass} resize-none`} />
          </div>

          {/* City + Meeting point */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Ville *</label>
              <select value={form.city} onChange={(e) => set("city", e.target.value)} required className={inputClass}>
                <option value="">Choisir</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Lieu de RDV *</label>
              <input value={form.meetingPoint} onChange={(e) => set("meetingPoint", e.target.value)} placeholder="Parking principal..." required className={inputClass} />
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Heure *</label>
              <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} required className={inputClass} />
            </div>
          </div>

          {/* Max participants + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Max participants</label>
              <input type="number" min="2" max="100" value={form.maxParticipants} onChange={(e) => set("maxParticipants", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Prix/personne (0 = gratuit)</label>
              <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" className={inputClass} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Tags (séparés par virgule)</label>
            <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="plage, barbecue, famille..." className={inputClass} />
          </div>

          {/* Organizer */}
          {!user && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Votre nom</label>
                <input value={form.organizerName} onChange={(e) => set("organizerName", e.target.value)} placeholder="Karim A." className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Téléphone</label>
                <input value={form.organizerPhone} onChange={(e) => set("organizerPhone", e.target.value)} placeholder="06 XX XX XX XX" className={inputClass} />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</> : "Créer la sortie 🎉"}
          </button>
        </form>
      </div>
    </div>
  );
}
