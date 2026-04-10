import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Rachra.com",
};

const sections = [
  {
    title: "1. Acceptation des conditions",
    content: `En accédant à Rachra.com et en utilisant nos services, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.`,
  },
  {
    title: "2. Description du service",
    content: `Rachra.com est une plateforme en ligne permettant la mise en relation entre propriétaires/prestataires et locataires/clients pour la location de logements, véhicules et la réservation d'activités au Maroc. Rachra.com agit en qualité d'intermédiaire et n'est pas partie au contrat de location.`,
  },
  {
    title: "3. Inscription et compte utilisateur",
    content: `Pour utiliser certaines fonctionnalités de la plateforme, vous devez créer un compte. Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de votre mot de passe. Vous êtes responsable de toutes les activités effectuées depuis votre compte.`,
  },
  {
    title: "4. Règles de publication",
    content: `Les annonces publiées sur Rachra.com doivent être exactes et conformes à la réalité. Toute annonce trompeuse, frauduleuse ou contraire aux lois marocaines sera supprimée. Rachra.com se réserve le droit de modérer ou supprimer toute annonce sans préavis.`,
  },
  {
    title: "5. Paiements et commissions",
    content: `Rachra.com prélève une commission de 5% sur chaque transaction réalisée via la plateforme. Les paiements sont sécurisés par notre partenaire de paiement. En cas d'annulation, les politiques de remboursement de chaque annonce s'appliquent.`,
  },
  {
    title: "6. Responsabilité",
    content: `Rachra.com ne peut être tenu responsable des dommages résultant de l'utilisation de la plateforme, des interactions entre utilisateurs, ou de l'inexactitude des informations publiées par les prestataires. Chaque propriétaire/prestataire est responsable de la conformité de son offre avec la législation marocaine.`,
  },
  {
    title: "7. Propriété intellectuelle",
    content: `Le contenu de Rachra.com (logo, design, textes, code) est protégé par le droit d'auteur marocain et international. Toute reproduction sans autorisation est interdite. Les utilisateurs conservent les droits sur les photos qu'ils publient mais accordent à Rachra.com une licence d'utilisation.`,
  },
  {
    title: "8. Modification des conditions",
    content: `Rachra.com se réserve le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur la plateforme. La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.`,
  },
  {
    title: "9. Droit applicable",
    content: `Les présentes conditions sont régies par le droit marocain. Tout litige sera soumis à la compétence exclusive des tribunaux compétents du Maroc.`,
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales d&apos;Utilisation</h1>
        <p className="text-gray-500 text-sm">Dernière mise à jour : Avril 2026</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8">
        {sections.map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{content}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-5 bg-blue-50 rounded-2xl text-sm text-blue-800">
        Pour toute question concernant ces conditions, contactez-nous à{" "}
        <a href="mailto:legal@rachra.com" className="font-semibold underline">legal@rachra.com</a>
      </div>
    </div>
  );
}
