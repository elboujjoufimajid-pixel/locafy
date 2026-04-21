"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { CITIES } from "@/lib/data";
import type { Listing } from "@/lib/data";
import AdminSidebar from "@/components/AdminSidebar";
import ImageUploader from "@/components/ImageUploader";
import { ArrowLeft, Save } from "lucide-react";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    fetch(`/api/db/listings/${params.id}?admin=true`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (!data) router.push("/admin/listings"); else setListing(data); });
  }, [router, params.id]);

  if (!listing) return null;

  function set(key: string, value: string | boolean | number) {
    setListing((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  function setPolicy(key: string, value: string | boolean) {
    setListing((prev) => {
      if (!prev) return prev;
      const p = prev.policies;
      return {
        ...prev,
        policies: {
          cancellation: (p?.cancellation ?? "Annulation gratuite jusqu'à 24h avant l'arrivée") as string,
          checkIn: (p?.checkIn ?? "14:00") as string,
          checkOut: (p?.checkOut ?? "11:00") as string,
          pets: (p?.pets ?? false) as boolean,
          smoking: p?.smoking ?? false,
          [key]: value,
        } as import("@/lib/data").ListingPolicies,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!listing) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    await fetch(`/api/db/listings/${listing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listing),
    });
    setSaved(true);
    setSaving(false);
    setTimeout(() => router.push("/admin/listings"), 1200);
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide";

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/admin/listings" className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modifier l&apos;annonce</h1>
              <p className="text-gray-500 text-sm truncate max-w-xs">{listing.title}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800">Informations générales</h2>
              <div>
                <label className={labelClass}>Titre *</label>
                <input required value={listing.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Type *</label>
                  <select value={listing.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                    <option value="apartment">Appartement</option>
                    <option value="house">Maison / Villa</option>
                    <option value="car">Voiture</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ville *</label>
                  <select value={listing.city} onChange={(e) => set("city", e.target.value)} className={inputClass}>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Adresse</label>
                <input value={listing.address} onChange={(e) => set("address", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea required value={listing.description} onChange={(e) => set("description", e.target.value)} rows={3} className={`${inputClass} resize-none`} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800">Prix</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Prix / jour (MAD) *</label>
                  <input required type="number" value={listing.pricePerDay} onChange={(e) => set("pricePerDay", Number(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Prix / mois (MAD)</label>
                  <input type="number" value={listing.pricePerMonth || ""} onChange={(e) => set("pricePerMonth", Number(e.target.value))} className={inputClass} />
                </div>
              </div>
            </div>

            {listing.type !== "car" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-semibold text-gray-800">Détails logement</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Chambres</label>
                    <input type="number" value={listing.bedrooms || ""} onChange={(e) => set("bedrooms", Number(e.target.value))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Salles de bain</label>
                    <input type="number" value={listing.bathrooms || ""} onChange={(e) => set("bathrooms", Number(e.target.value))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Superficie (m²)</label>
                    <input type="number" value={listing.area || ""} onChange={(e) => set("area", Number(e.target.value))} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {listing.type === "car" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-semibold text-gray-800">Détails voiture</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Marque</label><input value={listing.brand || ""} onChange={(e) => set("brand", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Modèle</label><input value={listing.model || ""} onChange={(e) => set("model", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Année</label><input type="number" value={listing.year || ""} onChange={(e) => set("year", Number(e.target.value))} className={inputClass} /></div>
                  <div><label className={labelClass}>Places</label><input type="number" value={listing.seats || ""} onChange={(e) => set("seats", Number(e.target.value))} className={inputClass} /></div>
                  <div>
                    <label className={labelClass}>Boîte</label>
                    <select value={listing.transmission || "Manuelle"} onChange={(e) => set("transmission", e.target.value)} className={inputClass}>
                      <option>Manuelle</option>
                      <option>Automatique</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800">Images & équipements</h2>
              <div>
                <label className={labelClass}>Photos</label>
                <ImageUploader images={listing.images} onChange={(imgs) => setListing((prev) => prev ? { ...prev, images: imgs } : prev)} />
              </div>
              <div>
                <label className={labelClass}>Équipements (séparés par virgules)</label>
                <input value={listing.amenities.join(", ")} onChange={(e) => setListing((prev) => prev ? { ...prev, amenities: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } : prev)} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Note (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={listing.rating} onChange={(e) => set("rating", Number(e.target.value))} className={inputClass} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={listing.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Disponible</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800">Politique & Règlement</h2>
              <div>
                <label className={labelClass}>Politique d&apos;annulation</label>
                <select
                  value={listing.policies?.cancellation || "Annulation gratuite jusqu'à 24h avant l'arrivée"}
                  onChange={(e) => setPolicy("cancellation", e.target.value)}
                  className={inputClass}
                >
                  <option>Annulation gratuite jusqu&apos;à 24h avant l&apos;arrivée</option>
                  <option>Annulation gratuite jusqu&apos;à 48h avant l&apos;arrivée</option>
                  <option>Annulation gratuite jusqu&apos;à 7 jours avant l&apos;arrivée</option>
                  <option>Non remboursable</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Check-in</label>
                  <input type="time" value={listing.policies?.checkIn || "14:00"}
                    onChange={(e) => setPolicy("checkIn", e.target.value)}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Check-out</label>
                  <input type="time" value={listing.policies?.checkOut || "11:00"}
                    onChange={(e) => setPolicy("checkOut", e.target.value)}
                    className={inputClass} />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={listing.policies?.pets || false}
                    onChange={(e) => setPolicy("pets", e.target.checked)}
                    className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700">🐾 Animaux acceptés</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={listing.policies?.smoking || false}
                    onChange={(e) => setPolicy("smoking", e.target.checked)}
                    className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700">🚬 Fumeurs acceptés</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving || saved} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
                <Save className="w-4 h-4" />
                {saved ? "✓ Enregistré !" : saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
              <Link href="/admin/listings" className="text-gray-500 hover:text-gray-700 text-sm">Annuler</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
