"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { getUserReservations } from "@/lib/adminStore";
import type { Reservation } from "@/lib/adminStore";
import { getCurrentUser, userLogout } from "@/lib/userAuth";
import type { UserProfile } from "@/lib/userAuth";
import { PlusCircle, Calendar, MapPin, Star, LogOut, User, Phone, Mail, CheckCircle2, Clock, XCircle, Heart } from "lucide-react";

const statusConfig = {
  confirmed: { label: "Confirmée", cls: "bg-green-100 text-green-700", icon: CheckCircle2 },
  pending: { label: "En attente", cls: "bg-yellow-100 text-yellow-700", icon: Clock },
  cancelled: { label: "Annulée", cls: "bg-red-100 text-red-700", icon: XCircle },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/auth/login"); return; }
    setUser(u);
    setReservations(getUserReservations(u.email));
    setReady(true);
  }, [router]);

  function handleLogout() {
    userLogout();
    router.push("/");
  }

  if (!ready) return null;

  const totalSpent = reservations.filter(r => r.status !== "cancelled").reduce((s, r) => s + r.total, 0);
  const confirmed = reservations.filter(r => r.status === "confirmed").length;
  const pending = reservations.filter(r => r.status === "pending").length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gérez vos réservations et votre compte</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm border border-gray-200 px-3 py-2 rounded-lg hover:border-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — reservations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total dépensé", value: formatPrice(totalSpent), color: "text-blue-700 bg-blue-50" },
              { label: "Confirmées", value: confirmed, color: "text-green-700 bg-green-50" },
              { label: "En attente", value: pending, color: "text-yellow-700 bg-yellow-50" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <div className={`text-xl font-bold mb-1 ${color.split(" ")[0]}`}>{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          {/* Reservations list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Mes réservations</h2>
              <Link href="/listings" className="text-xs text-blue-700 font-medium hover:underline">
                Nouvelle réservation
              </Link>
            </div>

            {reservations.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Aucune réservation pour l&apos;instant</p>
                <p className="text-gray-400 text-sm mt-1">Explorez nos annonces et activités</p>
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Parcourir les annonces
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {reservations.map((r) => {
                  const status = statusConfig[r.status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <div key={r.id} className="px-6 py-4 flex items-center gap-4">
                      {r.listingImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.listingImage}
                          alt={r.listingTitle}
                          className="w-14 h-14 object-cover rounded-xl shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{r.listingTitle}</p>
                        {r.listingCity && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{r.listingCity}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {r.startDate} → {r.endDate}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-gray-900 text-sm">{formatPrice(r.total)}</p>
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${status.cls}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/listings" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3 hover:border-blue-300 transition-colors group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <PlusCircle className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Réserver un logement</p>
                <p className="text-xs text-gray-400">Appartements & Maisons</p>
              </div>
            </Link>
            <Link href="/activities" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3 hover:border-blue-300 transition-colors group">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Star className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Découvrir activités</p>
                <p className="text-xs text-gray-400">Quad, restaurants, excursions</p>
              </div>
            </Link>
            <Link href="/dashboard/favoris" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3 hover:border-red-300 transition-colors group">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Mes favoris</p>
                <p className="text-xs text-gray-400">Annonces sauvegardées</p>
              </div>
            </Link>
            <Link href="/dashboard/new" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3 hover:border-green-300 transition-colors group">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Calendar className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Publier une annonce</p>
                <p className="text-xs text-gray-400">Gratuit & rapide</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right — profile */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Mon profil</h2>
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <User className="w-8 h-8 text-blue-700" />
              </div>
              <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${user?.role === "owner" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                {user?.role === "owner" ? "🔑 Propriétaire" : "🏠 Locataire"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-gray-600 truncate">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">{user.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400">
              Membre depuis {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString("fr-MA", { month: "long", year: "numeric" }) : "—"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
            <p className="font-semibold mb-1">Vous êtes propriétaire ?</p>
            <p className="text-blue-200 text-xs mb-4">Publiez votre bien et commencez à recevoir des réservations.</p>
            <Link
              href="/contact"
              className="block text-center bg-white text-blue-700 font-semibold text-sm py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
