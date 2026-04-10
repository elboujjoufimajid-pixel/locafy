import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Rachra.com",
  description: "Contactez l'équipe Rachra.com pour toute question, partenariat ou publication d'annonce. Réponse sous 24h.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
