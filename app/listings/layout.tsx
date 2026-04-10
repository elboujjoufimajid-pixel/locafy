import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annonces de location — Appartements, Maisons & Voitures au Maroc",
  description: "Parcourez nos annonces de location : appartements, maisons, villas et voitures dans toutes les villes du Maroc. Trouvez le bien idéal au meilleur prix.",
};

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
