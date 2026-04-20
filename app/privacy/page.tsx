import type { Metadata } from "next";
import { Shield, Database, Share2, Cookie, Lock, UserCheck, Clock, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Rachra.com",
  description: "Découvrez comment Rachra.com collecte, utilise et protège vos données personnelles.",
};

const sections = [
  {
    id: "donnees",
    icon: Database,
    title: "Données collectées",
    color: "bg-blue-50 text-blue-600",
    content: [
      {
        subtitle: "Données d'inscription",
        text: "Lorsque vous créez un compte, nous collectons votre nom complet, adresse email, numéro de téléphone et mot de passe (stocké sous forme hashée).",
      },
      {
        subtitle: "Données de réservation",
        text: "Lors d'une réservation, nous enregistrons les dates, le logement ou service choisi, et le montant total. Aucune donnée bancaire complète n'est stockée sur nos serveurs.",
      },
      {
        subtitle: "Données de navigation",
        text: "Nous collectons automatiquement des données techniques : adresse IP, type de navigateur, pages visitées, durée de session, via des cookies analytiques anonymes.",
      },
    ],
  },
  {
    id: "utilisation",
    icon: UserCheck,
    title: "Utilisation des données",
    color: "bg-emerald-50 text-emerald-600",
    content: [
      {
        subtitle: "Gestion de votre compte",
        text: "Vos données nous permettent de gérer votre compte, traiter vos réservations, vous envoyer des confirmations et vous contacter en cas de besoin.",
      },
      {
        subtitle: "Amélioration du service",
        text: "Nous analysons les comportements de navigation de manière anonyme pour améliorer notre plateforme, personnaliser votre expérience et développer de nouvelles fonctionnalités.",
      },
      {
        subtitle: "Communication",
        text: "Nous vous envoyons des emails transactionnels (confirmations, rappels) et, avec votre accord, des communications marketing. Vous pouvez vous désinscrire à tout moment.",
      },
    ],
  },
  {
    id: "partage",
    icon: Share2,
    title: "Partage des données",
    color: "bg-purple-50 text-purple-600",
    content: [
      {
        subtitle: "Propriétaires et prestataires",
        text: "Vos coordonnées (nom, téléphone) sont partagées avec le propriétaire ou prestataire uniquement après confirmation d'une réservation.",
      },
      {
        subtitle: "Partenaires techniques",
        text: "Nous travaillons avec des prestataires de confiance (hébergement, emailing) soumis à des accords de confidentialité stricts. Nous ne vendons jamais vos données.",
      },
      {
        subtitle: "Obligations légales",
        text: "Nous pouvons divulguer vos données si la loi l'exige ou pour protéger nos droits et la sécurité de nos utilisateurs.",
      },
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies",
    color: "bg-orange-50 text-orange-600",
    content: [
      {
        subtitle: "Cookies essentiels",
        text: "Indispensables au fonctionnement du site : gestion de session, sécurité, préférences de langue. Ils ne peuvent pas être désactivés.",
      },
      {
        subtitle: "Cookies analytiques",
        text: "Permettent de mesurer l'audience de manière anonyme (pages visitées, durée). Ils nous aident à améliorer votre expérience.",
      },
      {
        subtitle: "Gestion des cookies",
        text: "Vous pouvez désactiver les cookies non essentiels dans les paramètres de votre navigateur à tout moment sans affecter l'accès au site.",
      },
    ],
  },
  {
    id: "securite",
    icon: Lock,
    title: "Sécurité des données",
    color: "bg-red-50 text-red-600",
    content: [
      {
        subtitle: "Chiffrement",
        text: "Toutes les communications entre votre navigateur et nos serveurs sont chiffrées via le protocole SSL/TLS. Vos mots de passe sont hashés avec bcrypt.",
      },
      {
        subtitle: "Accès restreint",
        text: "L'accès à vos données est limité aux personnes qui en ont besoin pour vous fournir nos services. Nos équipes sont formées aux bonnes pratiques de sécurité.",
      },
    ],
  },
  {
    id: "droits",
    icon: Shield,
    title: "Vos droits",
    color: "bg-teal-50 text-teal-600",
    content: [
      {
        subtitle: "Droit d'accès et rectification",
        text: "Vous pouvez consulter et modifier vos données personnelles à tout moment depuis votre tableau de bord, rubrique « Mon profil ».",
      },
      {
        subtitle: "Droit à l'effacement",
        text: "Vous pouvez demander la suppression de votre compte et de vos données en nous contactant. Certaines données peuvent être conservées pour des raisons légales.",
      },
      {
        subtitle: "Loi applicable",
        text: "Conformément à la loi 09-08 relative à la protection des données personnelles au Maroc, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition.",
      },
    ],
  },
  {
    id: "conservation",
    icon: Clock,
    title: "Conservation des données",
    color: "bg-yellow-50 text-yellow-600",
    content: [
      {
        subtitle: "Durée de conservation",
        text: "Vos données sont conservées pendant toute la durée de votre compte actif, puis 3 ans après sa fermeture pour des raisons légales.",
      },
      {
        subtitle: "Données de réservation",
        text: "Les informations liées aux réservations sont conservées 5 ans conformément aux obligations fiscales et comptables marocaines.",
      },
    ],
  },
  {
    id: "contact",
    icon: Mail,
    title: "Nous contacter",
    color: "bg-gray-100 text-gray-600",
    content: [
      {
        subtitle: "Délégué à la Protection des Données",
        text: "Pour exercer vos droits ou pour toute question relative à la protection de vos données personnelles, contactez-nous à l'adresse : privacy@rachra.com",
      },
      {
        subtitle: "Délai de réponse",
        text: "Nous nous engageons à répondre à toute demande dans un délai maximum de 30 jours ouvrés à compter de la réception de votre demande.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-blue-200 text-sm font-medium">Rachra.com</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Politique de confidentialité</h1>
          <p className="text-blue-200 text-base max-w-xl">
            Votre vie privée compte. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles.
          </p>
          <p className="text-blue-300 text-sm mt-4">Dernière mise à jour : Avril 2026</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar — table of contents */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sommaire</p>
              <nav className="space-y-1">
                {sections.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-blue-700 py-1.5 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {s.title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 space-y-6">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  id={s.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-24"
                >
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-gray-900">{s.title}</h2>
                  </div>
                  <div className="px-6 py-5 space-y-5">
                    {s.content.map((c) => (
                      <div key={c.subtitle}>
                        <p className="text-sm font-semibold text-gray-800 mb-1">{c.subtitle}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Contact CTA */}
            <div className="bg-blue-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-1">Une question sur vos données ?</h3>
              <p className="text-blue-200 text-sm mb-4">Notre équipe est disponible pour répondre à toutes vos questions concernant votre vie privée.</p>
              <a
                href="mailto:privacy@rachra.com"
                className="inline-block bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Contacter la DPO
              </a>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
