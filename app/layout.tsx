import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Rachra.com — Location & Réservation Partout au Maroc",
    template: "%s — Rachra.com",
  },
  description:
    "Trouvez les meilleures locations d'appartements, maisons, voitures et activités partout au Maroc. Casablanca, Marrakech, Agadir, Tanger, Oujda et plus.",
  keywords: ["location Maroc", "appartement Maroc", "voiture location Maroc", "riad Marrakech", "Rachra"],
  authors: [{ name: "Rachra.com" }],
  openGraph: {
    title: "Rachra.com — Location & Réservation Partout au Maroc",
    description: "La plateforme de location N°1 au Maroc. Appartements, maisons, voitures et activités dans 120+ villes.",
    type: "website",
    locale: "fr_MA",
    siteName: "Rachra.com",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

