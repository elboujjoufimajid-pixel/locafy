import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size={56} />
        </div>
        <h1 className="text-7xl font-extrabold text-blue-600 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Page introuvable</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.<br />
          Revenez à l&apos;accueil pour continuer votre recherche.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/listings"
            className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Voir les annonces
          </Link>
        </div>
      </div>
    </div>
  );
}
