"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { saveListing } from "@/lib/adminStore";
import { CITIES } from "@/lib/data";
import type { Listing } from "@/lib/data";
import AdminSidebar from "@/components/AdminSidebar";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewListingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) router.push("/admin/login");
  }, [router]);

  const [form, setForm] = useState({
    title: "",
    type: "apartment" as Listing["type"],
    city: "Casablanca",
    address: "",
    description: "",
    pricePerDay: "",
    pricePerMonth: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    brand: "",
    model: "",
    year: "",
    seats: "",
    transmission: "Manuelle",
    amenities: "",
    images: "",
    rating: "4.5",
    reviewCount: "0",
    available: true,
  });

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    const listing: Listing = {
      id: `l${Date.now()}`,
      title: form.title,
      type: form.type,
      city: form.city,
      address: form.address,
      description: form.description,
      pricePerDay: Number(form.pricePerDay),
      pricePerMonth: form.pricePerMonth ? Number(form.pricePerMonth) : undefined,
      images: form.images ? form.images.split("\n").map((s) => s.trim()).filter(Boolean) : ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
      amenities: form.amenities ? form.amenities.split(",").map((s) => s.trim()).filter(Boolean) : [],
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      owner: { name: "Admin Rachra", phone: "0600000000", avatar: "AL" },
      available: form.available,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      area: form.area ? Number(form.area) : undefined,
      brand: form.brand || undefined,
      model: form.model || undefined,
      year: form.year ? Number(form.year) : undefined,
      seats: form.seats ? Number(form.seats) : undefined,
      transmission: form.transmission || undefined,
    };

    saveListing(listing);
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
              <h1 className="text-2xl font-bold text-gray-900">Nouvelle annonce</h1>
              <p className="text-gray-500 text-sm">Remplissez les informations de l&apos;annonce</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800 mb-2">Informations générales</h2>
              <div>
                <label className={labelClass}>Titre *</label>
                <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Appartement Moderne Centre Casablanca" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Type *</label>
                  <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                    <option value="apartment">Appartement</option>
                    <option value="house">Maison / Villa</option>
                    <option value="car">Voiture</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ville *</label>
                  <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass}>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Adresse</label>
                <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Ex: Boulevard Mohammed V, Centre Ville" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea required value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Décrivez l'annonce..." className={`${inputClass} resize-none`} />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800 mb-2">Prix</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Prix / jour (MAD) *</label>
                  <input required type="number" value={form.pricePerDay} onChange={(e) => set("pricePerDay", e.target.value)} placeholder="350" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Prix / mois (MAD)</label>
                  <input type="number" value={form.pricePerMonth} onChange={(e) => set("pricePerMonth", e.target.value)} placeholder="4500" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Type-specific */}
            {form.type !== "car" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-semibold text-gray-800 mb-2">Détails logement</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Chambres</label>
                    <input type="number" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} placeholder="2" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Salles de bain</label>
                    <input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} placeholder="1" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Superficie (m²)</label>
                    <input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="85" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {form.type === "car" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-semibold text-gray-800 mb-2">Détails voiture</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Marque</label>
                    <input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Dacia" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Modèle</label>
                    <input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="Logan" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Année</label>
                    <input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2023" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Places</label>
                    <input type="number" value={form.seats} onChange={(e) => set("seats", e.target.value)} placeholder="5" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Boîte</label>
                    <select value={form.transmission} onChange={(e) => set("transmission", e.target.value)} className={inputClass}>
                      <option>Manuelle</option>
                      <option>Automatique</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Media & extras */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-semibold text-gray-800 mb-2">Images & équipements</h2>
              <div>
                <label className={labelClass}>URLs des images (une par ligne)</label>
                <textarea value={form.images} onChange={(e) => set("images", e.target.value)} rows={3} placeholder="https://images.unsplash.com/..." className={`${inputClass} resize-none font-mono text-xs`} />
              </div>
              <div>
                <label className={labelClass}>Équipements (séparés par virgules)</label>
                <input value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="WiFi, Climatisation, Parking, Piscine" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Note (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set("rating", e.target.value)} className={inputClass} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Disponible</span>
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
                {saved ? "✓ Enregistré !" : saving ? "Enregistrement..." : "Enregistrer l'annonce"}
              </button>
              <Link href="/admin/listings" className="text-gray-500 hover:text-gray-700 text-sm">Annuler</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
