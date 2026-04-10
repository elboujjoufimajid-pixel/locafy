"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition bg-white";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Logo size={52} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Contactez-nous</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Une question, un partenariat, ou vous souhaitez publier votre bien sur Rachra.com ?
          Notre équipe est là pour vous.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact cards */}
          {[
            {
              icon: Mail,
              label: "Email",
              value: "contact@rachra.com",
              sub: "Réponse sous 24h",
              color: "bg-blue-50 text-blue-700",
            },
            {
              icon: Phone,
              label: "Téléphone",
              value: "+212 6XX XXX XXX",
              sub: "Lun–Sam, 9h–18h",
              color: "bg-green-50 text-green-700",
            },
            {
              icon: MapPin,
              label: "Adresse",
              value: "Casablanca, Maroc",
              sub: "Quartier des Affaires",
              color: "bg-purple-50 text-purple-700",
            },
            {
              icon: MessageSquare,
              label: "WhatsApp",
              value: "Chat en direct",
              sub: "Disponible 7j/7",
              color: "bg-orange-50 text-orange-700",
            },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="font-semibold text-gray-900 text-sm">{value}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
          ))}

          {/* Why us */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
            <h3 className="font-semibold mb-3">Pourquoi Rachra.com ?</h3>
            <ul className="space-y-2">
              {[
                "120+ villes couvertes au Maroc",
                "3 types de location : appart, maison, voiture",
                "Activités & excursions locales",
                "Paiement sécurisé CMI",
                "Support en Arabe, Français, Anglais",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-blue-100 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Message envoyé !</h2>
                <p className="text-gray-500 text-sm">
                  Merci de nous avoir contactés. Notre équipe vous répondra sous 24h.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 text-blue-600 text-sm hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Nom complet *</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className={inputClass}
                        placeholder="Mohamed Alami"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={inputClass}
                        placeholder="vous@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Sujet *</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="reservation">Question sur une réservation</option>
                      <option value="owner">Je veux publier mon bien</option>
                      <option value="partnership">Partenariat / Activité</option>
                      <option value="technical">Problème technique</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Message *</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="Décrivez votre demande..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60"
                  >
                    {loading ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
