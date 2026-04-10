import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Rachra.com",
};

const sections = [
  {
    title: "1. Données collectées",
    content: `Nous collectons les données que vous nous fournissez lors de l'inscription (nom, email, téléphone), lors d'une réservation (informations de paiement masquées), et les données de navigation (pages visitées, recherches effectuées) via des cookies analytiques.`,
  },
  {
    title: "2. Utilisation des données",
    content: `Vos données personnelles sont utilisées pour : gérer votre compte et vos réservations, vous envoyer des confirmations et notifications, améliorer nos services, prévenir la fraude, et respecter nos obligations légales. Nous ne vendons jamais vos données à des tiers.`,
  },
  {
    title: "3. Partage des données",
    content: `Vos coordonnées sont partagées avec les propriétaires/prestataires uniquement dans le cadre d'une réservation confirmée. Nous travaillons avec des partenaires de confiance (paiement, hébergement) soumis à des obligations de confidentialité strictes.`,
  },
  {
    title: "4. Cookies",
    content: `Rachra.com utilise des cookies nécessaires au fonctionnement du site, des cookies analytiques anonymes (mesure d'audience), et des cookies de préférences (langue, devise). Vous pouvez désactiver les cookies non essentiels dans les paramètres de votre navigateur.`,
  },
  {
    title: "5. Sécurité des données",
    content: `Nous protégeons vos données via le chiffrement SSL/TLS, le stockage sécurisé des mots de passe (hashage bcrypt), et des accès restreints à nos systèmes. Aucune donnée bancaire complète n'est stockée sur nos serveurs.`,
  },
  {
    title: "6. Vos droits",
    content: `Conformément à la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel au Maroc, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données personnelles.`,
  },
  {
    title: "7. Conservation des données",
    content: `Vos données sont conservées pendant la durée de votre compte et 3 ans après sa suppression pour des raisons légales. Les données de réservation sont conservées 5 ans conformément aux obligations fiscales marocaines.`,
  },
  {
    title: "8. Contact DPO",
    content: `Pour exercer vos droits ou pour toute question relative à la protection de vos données, contactez notre Délégué à la Protection des Données : privacy@rachra.com`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
        <p className="text-gray-500 text-sm">Dernière mise à jour : Avril 2026</p>
      </div>

      <div className="space-y-8">
        {sections.map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{content}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-5 bg-blue-50 rounded-2xl text-sm text-blue-800">
        Pour exercer vos droits :{" "}
        <a href="mailto:privacy@rachra.com" className="font-semibold underline">privacy@rachra.com</a>
      </div>
    </div>
  );
}
