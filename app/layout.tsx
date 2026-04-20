import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import BottomNav from "@/components/BottomNav";
import Tracker from "@/components/Tracker";

export const metadata: Metadata = {
  title: {
    default: "Rachra.com — Location & Réservation Partout au Maroc",
    template: "%s — Rachra.com",
  },
  description:
    "Trouvez les meilleures locations d'appartements, maisons, voitures et activités partout au Maroc. Casablanca, Marrakech, Agadir, Tanger, Oujda et plus.",
  keywords: ["location Maroc", "appartement Maroc", "voiture location Maroc", "riad Marrakech", "Rachra"],
  authors: [{ name: "Rachra.com" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rachra",
  },
  openGraph: {
    title: "Rachra.com — Location & Réservation Partout au Maroc",
    description: "La plateforme de location N°1 au Maroc. Appartements, maisons, voitures et activités dans 120+ villes.",
    type: "website",
    locale: "fr_MA",
    siteName: "Rachra.com",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <meta name="theme-color" content="#003580" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-W4D8E5BKNT" />
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-W4D8E5BKNT');
        `}} />
        <script dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
          }
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>
          <Tracker />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <div className="hidden md:block"><Footer /></div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}

