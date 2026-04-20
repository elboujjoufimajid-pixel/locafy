import type { Metadata } from "next";
import { FileText, Briefcase, User, Megaphone, CreditCard, AlertTriangle, Copyright, RefreshCw, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — Rachra.com",
  description: "Lisez les conditions générales d'utilisation de la plateforme Rachra.com.",
};

const sections = [
  {
    id: "acceptation",
    icon: FileText,
    title: "Acceptation des conditions",
    color: "bg-blue-50 text-blue-600",
    content: [
      {
        subtitle: "Accord obligatoire",
        text: "En accédant à Rachra.com et en utilisant nos services, vous acceptez pleinement et sans réserve les présentes Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.",
      },
      {
        subtitle: "Capacité juridique",
        text: "En utilisant Rachra.com, vous déclarez avoir au moins 18 ans et la capacité juridique de conclure un contrat contraignant selon la loi marocaine applicable.",
      },
    ],
  },
  {
    id: "service",
    icon: Briefcase,
    title: "Description du service",
    color: "bg-emerald-50 text-emerald-600",
    content: [
      {
        subtitle: "Notre rôle d'intermédiaire",
        text: "Rachra.com est une plateforme en ligne de mise en relation entre propriétaires/prestataires et locataires/clients pour la location de logements, véhicules et la réservation d'activités au Maroc. Rachra.com agit en qualité d'intermédiaire et n'est pas partie au contrat de location.",
      },
      {
        subtitle: "Disponibilité du service",
        text: "Nous nous efforçons de maintenir Rachra.com disponible 24h/24 et 7j/7. Toutefois, nous ne pouvons garantir une disponibilité permanente et nous réservons le droit d'interrompre temporairement le service pour maintenance.",
      },
    ],
  },
  {
    id: "compte",
    icon: User,
    title: "Inscription et compte utilisateur",
    color: "bg-purple-50 text-purple-600",
    content: [
      {
        subtitle: "Création de compte",
        text: "Pour accéder à certaines fonctionnalités (réservation, publication d'annonces), vous devez créer un compte en fournissant des informations exactes, complètes et à jour.",
      },
      {
        subtitle: "Sécurité du compte",
        text: "Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées depuis votre compte. En cas de compromission, contactez-nous immédiatement.",
      },
      {
        subtitle: "Suspension de compte",
        text: "Rachra.com se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU, de comportement frauduleux, ou de fourniture d'informations inexactes.",
      },
    ],
  },
  {
    id: "annonces",
    icon: Megaphone,
    title: "Règles de publication",
    color: "bg-orange-50 text-orange-600",
    content: [
      {
        subtitle: "Contenu des annonces",
        text: "Toute annonce publiée sur Rachra.com doit être exacte, véridique et conforme à la réalité. Les photos doivent représenter fidèlement le bien ou service proposé.",
      },
      {
        subtitle: "Contenu interdit",
        text: "Sont strictement interdits : les annonces trompeuses ou frauduleuses, les contenus illégaux, les offres en violation de la loi marocaine, et toute forme de discrimination.",
      },
      {
        subtitle: "Modération",
        text: "Rachra.com se réserve le droit de modérer, modifier ou supprimer toute annonce sans préavis et sans obligation de justification.",
      },
    ],
  },
  {
    id: "paiements",
    icon: CreditCard,
    title: "Paiements et commissions",
    color: "bg-teal-50 text-teal-600",
    content: [
      {
        subtitle: "Commission Rachra.com",
        text: "Rachra.com prélève une commission de 10% sur chaque transaction réalisée via la plateforme. Cette commission couvre les frais de service, de mise en relation et de support.",
      },
      {
        subtitle: "Modalités de paiement",
        text: "Les paiements s'effectuent par virement bancaire CIB Bank (RIB : 230500283457821101640061) ou via WhatsApp avec confirmation. Un récapitulatif complet vous est envoyé après chaque réservation.",
      },
      {
        subtitle: "Politique d'annulation",
        text: "En cas d'annulation, les conditions propres à chaque annonce s'appliquent. Rachra.com n'est pas responsable des litiges entre propriétaires et locataires concernant les remboursements.",
      },
    ],
  },
  {
    id: "responsabilite",
    icon: AlertTriangle,
    title: "Responsabilité",
    color: "bg-red-50 text-red-600",
    content: [
      {
        subtitle: "Limitation de responsabilité",
        text: "Rachra.com ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme, des interactions entre utilisateurs, ou de l'inexactitude des informations publiées.",
      },
      {
        subtitle: "Responsabilité des propriétaires",
        text: "Chaque propriétaire ou prestataire est seul responsable de la conformité de son offre avec la législation marocaine, de l'exactitude des informations publiées et de la qualité des services fournis.",
      },
    ],
  },
  {
    id: "propriete",
    icon: Copyright,
    title: "Propriété intellectuelle",
    color: "bg-yellow-50 text-yellow-600",
    content: [
      {
        subtitle: "Contenu Rachra.com",
        text: "Le logo, le design, les textes, le code et l'ensemble du contenu de Rachra.com sont protégés par le droit d'auteur marocain et international. Toute reproduction sans autorisation écrite est interdite.",
      },
      {
        subtitle: "Contenu utilisateur",
        text: "Les utilisateurs conservent les droits sur les photos et textes qu'ils publient, mais accordent à Rachra.com une licence non exclusive d'utilisation pour affichage sur la plateforme.",
      },
    ],
  },
  {
    id: "modifications",
    icon: RefreshCw,
    title: "Modification des conditions",
    color: "bg-indigo-50 text-indigo-600",
    content: [
      {
        subtitle: "Droit de modification",
        text: "Rachra.com se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur la plateforme.",
      },
      {
        subtitle: "Notification",
        text: "En cas de modification substantielle, nous vous en informerons par email. La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.",
      },
    ],
  },
  {
    id: "droit",
    icon: Scale,
    title: "Droit applicable",
    color: "bg-gray-100 text-gray-600",
    content: [
      {
        subtitle: "Loi applicable",
        text: "Les présentes CGU sont régies par le droit marocain, notamment le Code des Obligations et Contrats (DOC) et la loi 53-05 relative à l'échange électronique de données juridiques.",
      },
      {
        subtitle: "Juridiction compétente",
        text: "Tout litige découlant de l'utilisation de Rachra.com sera soumis à la compétence exclusive des tribunaux compétents du Royaume du Maroc.",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-gray-400 text-sm font-medium">Rachra.com</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-gray-400 text-base max-w-xl">
            Veuillez lire attentivement ces conditions avant d'utiliser nos services. Elles définissent les règles d'utilisation de Rachra.com.
          </p>
          <p className="text-gray-500 text-sm mt-4">Dernière mise à jour : Avril 2026</p>
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
                      className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-gray-900 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
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
            <div className="bg-gray-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-1">Une question juridique ?</h3>
              <p className="text-gray-400 text-sm mb-4">Notre équipe est disponible pour répondre à vos questions concernant ces conditions d&apos;utilisation.</p>
              <a
                href="mailto:legal@rachra.com"
                className="inline-block bg-white text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Contacter notre équipe
              </a>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
