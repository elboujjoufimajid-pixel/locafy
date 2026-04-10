import Logo from "@/components/Logo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Rachra.com",
  description: "Découvrez l'histoire et la mission de Rachra.com, la plateforme de location N°1 au Maroc.",
};

const team = [
  { name: "Youssef Amrani", role: "CEO & Co-fondateur", emoji: "👨‍💼" },
  { name: "Sara Benmoussa", role: "CTO & Co-fondatrice", emoji: "👩‍💻" },
  { name: "Karim Tazi", role: "Responsable Produit", emoji: "👨‍🎨" },
  { name: "Fatima Zahra", role: "Directrice Marketing", emoji: "👩‍📊" },
];

const stats = [
  { value: "120+", label: "Villes couvertes" },
  { value: "500+", label: "Annonces actives" },
  { value: "2 000+", label: "Réservations" },
  { value: "98%", label: "Satisfaction client" },
];

const values = [
  { emoji: "🤝", title: "Confiance", desc: "Chaque annonce est vérifiée. Chaque hôte est évalué. Vous réservez en toute sécurité." },
  { emoji: "🌍", title: "National", desc: "De Tanger à Dakhla, de Casablanca à Oujda — Rachra.com couvre tout le Maroc." },
  { emoji: "⚡", title: "Simplicité", desc: "Trouver, réserver et payer en quelques clics. Simple, rapide, sans friction." },
  { emoji: "💚", title: "Local", desc: "Nous soutenons les propriétaires et prestataires locaux marocains." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size={64} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">
            À propos de Rachra<span className="text-blue-300">.ma</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Nous construisons la première plateforme de location complète du Maroc — logements, voitures et activités, partout dans le royaume.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Notre mission</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              Rendre la location accessible à tous les Marocains
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Rachra.com est né d&apos;un constat simple : trouver un logement, une voiture ou une activité au Maroc est encore trop compliqué. Les plateformes étrangères ne connaissent pas nos villes, nos prix, nos besoins.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Nous avons créé Rachra.com pour changer ça — une plateforme 100% marocaine, en arabe, français et anglais, couvrant les 120+ villes du royaume, des grandes métropoles aux petites communes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <div className="text-3xl font-extrabold text-blue-700 mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Nos valeurs</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Ce en quoi nous croyons</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">L&apos;équipe</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Les personnes derrière Rachra.com</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, emoji }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <div className="text-4xl mb-3">{emoji}</div>
                <p className="font-bold text-gray-900 text-sm">{name}</p>
                <p className="text-gray-500 text-xs mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Rejoignez l&apos;aventure Rachra.com</h2>
          <p className="text-blue-200 mb-6 max-w-lg mx-auto">
            Que vous soyez locataire, propriétaire ou prestataire d&apos;activités — il y a une place pour vous sur Rachra.com.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/listings" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Explorer les annonces
            </Link>
            <Link href="/contact" className="border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
