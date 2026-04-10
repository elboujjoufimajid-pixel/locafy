import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activités & Expériences au Maroc — Quad, Restaurants, Excursions",
  description: "Réservez les meilleures activités au Maroc : quad, surf, excursions désert, restaurants gastronomiques. Dakhla, Marrakech, Agadir, Fès et plus.",
};

export default function ActivitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
