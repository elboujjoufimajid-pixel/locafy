"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import { CITIES } from "@/lib/data";

const CAR_BRANDS = ["Dacia", "Renault", "Peugeot", "Citroën", "Toyota", "Hyundai", "Kia", "Volkswagen", "Ford", "Fiat", "Opel", "Seat", "Mercedes", "BMW", "Audi", "Nissan", "Honda", "Suzuki", "Chevrolet", "Skoda", "Volvo", "Mitsubishi", "Mazda", "Jeep"];
import { saveListing } from "@/lib/adminStore";
import { getCurrentUser } from "@/lib/userAuth";
import type { Listing } from "@/lib/data";

type Step = 1 | 2 | 3 | 4;

const typeOptions = [
  { value: "apartment", label: "Appartement", icon: "🏢" },
  { value: "house", label: "Maison / Villa", icon: "🏡" },
  { value: "car", label: "Voiture", icon: "🚗" },
  { value: "parking", label: "Parking / Garage", icon: "🅿️" },
  { value: "local", label: "Local commercial", icon: "🏪" },
];

const amenitiesList = ["WiFi", "Climatisation", "Parking", "Piscine", "Ascenseur", "Balcon", "Jardin", "Barbecue", "GPS", "Bluetooth", "Assurance incluse"];

export default function NewListingForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    type: "",
    title: "",
    city: "",
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
    amenities: [] as string[],
    usage: "",
    priceUnit: "day" as "day" | "month",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function compressImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 800;
          let w = img.width, h = img.height;
          if (w > MAX) { h = (h * MAX) / w; w = MAX; }
          if (h > MAX) { w = (w * MAX) / h; h = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
    const compressed = await Promise.all(valid.map(compressImage));
    setPhotos((prev) => [...prev, ...compressed].slice(0, 5));
  }

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const user = getCurrentUser();
    const ownerName = user ? `${user.firstName} ${user.lastName}` : form.contactName || "Propriétaire";
    const ownerPhone = user?.phone || form.contactPhone || "0600000000";
    const ownerAvatar = ownerName[0]?.toUpperCase() || "P";

    const newListing: Listing = {
      id: `listing_${Date.now()}`,
      type: form.type as Listing["type"],
      title: form.title,
      description: form.description,
      city: form.city,
      address: form.address,
      pricePerDay: Number(form.pricePerDay),
      pricePerMonth: form.pricePerMonth ? Number(form.pricePerMonth) : undefined,
      images: photos.length > 0 ? photos : ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
      amenities: form.amenities,
      rating: 0,
      reviewCount: 0,
      owner: {
        name: ownerName,
        phone: ownerPhone,
        avatar: ownerAvatar,
      },
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      area: form.area ? Number(form.area) : undefined,
      brand: form.brand || undefined,
      model: form.model || undefined,
      year: form.year ? Number(form.year) : undefined,
      seats: form.seats ? Number(form.seats) : undefined,
      transmission: form.transmission || undefined,
      available: true,
      usage: form.usage || undefined,
      priceUnit: (form.type === "parking" || form.type === "local") ? form.priceUnit : undefined,
    };

    // Save to database
    await fetch("/api/db/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newListing),
    }).catch(() => {});

    // Notify admin by email
    fetch("/api/notify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: newListing.type,
        title: newListing.title,
        city: newListing.city,
        pricePerDay: newListing.pricePerDay,
        ownerName: newListing.owner.name,
        ownerPhone: newListing.owner.phone,
        brand: newListing.brand,
        model: newListing.model,
        year: newListing.year,
        transmission: newListing.transmission,
        seats: newListing.seats,
      }),
    }).catch(() => {});

    if (user) {
      router.push("/dashboard");
    } else {
      setSubmitted(true);
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition";

  const user = getCurrentUser();

  const steps = [
    { n: 1, label: "Type & Infos" },
    { n: 2, label: "Détails" },
    { n: 3, label: "Photos & Prix" },
    ...(user ? [] : [{ n: 4, label: "Contact" }]),
  ];

  return (
    <div>
      {/* Success screen */}
      {submitted && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Annonce publiée !</h2>
          <p className="text-gray-500 text-sm mb-6">Votre annonce sera vérifiée et publiée sous 24h.</p>
          <div className="flex gap-3 justify-center">
            <a href="/listings" className="bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors">
              Voir les annonces
            </a>
            <a href="/auth/register" className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              Créer un compte
            </a>
          </div>
        </div>
      )}

      {!submitted && (
      <>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                step >= s.n ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {s.n}
            </div>
            <span className={`text-xs font-medium ${step >= s.n ? "text-blue-800" : "text-gray-400"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 ${step > s.n ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Type de bien</h2>
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

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Titre de l&apos;annonce *
              </label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Ex: Appartement moderne centre Oujda"
                required
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Ville *</label>
                <select
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Choisir</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Adresse *</label>
                <input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Quartier, rue..."
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Décrivez votre bien en détail..."
                required
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="button"
              disabled={!form.type || !form.title || !form.city || !form.address}
              onClick={() => setStep(2)}
              className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Détails du bien</h2>

            {(form.type === "parking" || form.type === "local") ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Surface (m²) — optionnel</label>
                  <input type="number" min="0" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="50" className={inputClass} />
                </div>
                {form.type === "local" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Usage suggéré (optionnel)</label>
                    <input
                      value={form.usage}
                      onChange={(e) => set("usage", e.target.value)}
                      placeholder="Restaurant, Snack, Commerce, Stockage, Bureau..."
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-400 mt-1">Laissez libre pour que les locataires proposent eux-mêmes</p>
                  </div>
                )}
              </div>
            ) : form.type !== "car" ? (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Chambres</label>
                  <input type="number" min="0" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} placeholder="2" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Salles de bain</label>
                  <input type="number" min="0" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} placeholder="1" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Surface (m²)</label>
                  <input type="number" min="0" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="85" className={inputClass} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Marque</label>
                  <div className="relative">
                    <input
                      value={form.brand}
                      onChange={(e) => set("brand", e.target.value)}
                      placeholder="Dacia, Renault..."
                      className={inputClass}
                      list="car-brands-list"
                      autoComplete="off"
                    />
                    <datalist id="car-brands-list">
                      {CAR_BRANDS.filter(b => !form.brand || b.toLowerCase().startsWith(form.brand.toLowerCase())).map(b => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Modèle</label>
                  <input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="Logan" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Année</label>
                  <input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2022" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Boîte</label>
                  <select value={form.transmission} onChange={(e) => set("transmission", e.target.value)} className={inputClass}>
                    <option>Manuelle</option>
                    <option>Automatique</option>
                  </select>
                </div>
              </div>
            )}

            {/* Amenities */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Équipements</label>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.amenities.includes(a)
                        ? "bg-blue-700 text-white border-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                ← Retour
              </button>
              <button type="button" onClick={() => setStep(3)} className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Photos & Prix</h2>

            {/* Upload zone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Photos (max 5)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
              >
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Glissez vos photos ici</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG — max 5MB chacune</p>
                <span className="mt-3 inline-block text-xs text-blue-700 border border-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                  Choisir des fichiers
                </span>
              </div>

              {/* Preview thumbnails */}
              {photos.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {photos.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPhotos((prev) => prev.filter((_, j) => j !== i)); }}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing */}
            {(form.type === "parking" || form.type === "local") && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Prix par</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priceUnit: "day" }))}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${form.priceUnit === "day" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}
                  >
                    Jour
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priceUnit: "month" }))}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${form.priceUnit === "month" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}
                  >
                    Mois
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Prix (MAD) {(form.type === "parking" || form.type === "local") ? `par ${form.priceUnit === "month" ? "mois" : "jour"}` : "par jour"} *
              </label>
              <input
                type="number"
                value={form.pricePerDay}
                onChange={(e) => set("pricePerDay", e.target.value)}
                placeholder={form.priceUnit === "month" ? "2000" : "350"}
                required
                min="1"
                className={inputClass}
              />
            </div>

            {form.type !== "car" && form.type !== "parking" && form.type !== "local" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Prix par mois (MAD) — optionnel
                </label>
                <input
                  type="number"
                  value={form.pricePerMonth}
                  onChange={(e) => set("pricePerMonth", e.target.value)}
                  placeholder="4500"
                  className={inputClass}
                />
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
              ✅ Votre annonce sera vérifiée et publiée sous 24h
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                ← Retour
              </button>
              {user ? (
                <button
                  type="submit"
                  disabled={loading || !form.pricePerDay}
                  className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Publication...</> : "Publier l'annonce"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!form.pricePerDay}
                  onClick={() => setStep(4)}
                  className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
                >
                  Suivant →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4 — Contact (visiteurs non connectés) */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Vos coordonnées</h2>
            <p className="text-sm text-gray-500">Pour que les clients puissent vous contacter.</p>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom complet *</label>
              <input
                value={form.contactName}
                onChange={(e) => set("contactName", e.target.value)}
                placeholder="Mohamed Benali"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Téléphone *</label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => set("contactPhone", e.target.value)}
                placeholder="06 XX XX XX XX"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)}
                placeholder="vous@email.com"
                className={inputClass}
              />
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
              ✅ Votre annonce sera vérifiée et publiée sous 24h
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(3)} className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                ← Retour
              </button>
              <button
                type="submit"
                disabled={loading || !form.contactName || !form.contactPhone}
                className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Publication...</> : "Publier l'annonce"}
              </button>
            </div>
          </div>
        )}
      </form>
      </>
      )}
    </div>
  );
}

