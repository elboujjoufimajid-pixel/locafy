"use client";

import { useParams, notFound } from "next/navigation";
import { MapPin, Star, Clock, Users, CheckCircle2, ChefHat, Calendar } from "lucide-react";
import { getActivityById } from "@/lib/adminStore";
import ActivityBookingForm from "@/components/ActivityBookingForm";
import { useT } from "@/lib/i18n";

const categoryColors = {
  outdoor: "bg-green-100 text-green-700",
  restaurant: "bg-orange-100 text-orange-700",
  excursion: "bg-purple-100 text-purple-700",
};

const categoryEmojis = {
  outdoor: "🏄",
  restaurant: "🍽️",
  excursion: "🗺️",
};

const idealForEmojis: Record<string, string> = {
  family: "👨‍👩‍👧‍👦",
  couple: "💑",
  group: "👥",
  solo: "🧍",
};

export default function ActivityDetailPage() {
  const params = useParams();
  const { t } = useT();
  const activity = getActivityById(params.id as string);
  if (!activity) notFound();

  const a = t.activities;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${categoryColors[activity.category]}`}>
            <span>{categoryEmojis[activity.category]}</span>
            {a.categoryLabels[activity.category]}
          </span>
          {activity.deal && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{activity.deal}% PROMO
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {activity.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-800">{activity.rating}</span>
            <span>({activity.reviewCount} {t.card.reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{activity.address}, {activity.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{activity.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{activity.minPersons}–{activity.maxPersons} {a.minMax}</span>
          </div>
        </div>
      </div>

      {/* Image gallery */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-8 h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activity.images[0]}
          alt={activity.title}
          className="w-full h-full object-cover col-span-1"
        />
        {activity.images[1] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activity.images[1]}
            alt={activity.title}
            className="w-full h-full object-cover col-span-1"
          />
        ) : (
          <div className="bg-gray-100 col-span-1" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* Provider */}
          <div className="flex items-center justify-between pb-6 border-b">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t.listing.by}{" "}
                <span className="text-blue-700">{activity.owner.name}</span>
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activity.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {activity.minPersons}–{activity.maxPersons} {a.minMax}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
              {activity.owner.avatar}
            </div>
          </div>

          {/* Ideal for */}
          <div className="pb-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{a.idealFor}</h2>
            <div className="flex flex-wrap gap-2">
              {activity.idealFor.map((f) => (
                <span key={f} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-sm font-medium">
                  <span>{idealForEmojis[f]}</span>
                  {a[f]}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="pb-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t.listing.description}</h2>
            <p className="text-gray-600 leading-relaxed">{activity.description}</p>
          </div>

          {/* Included */}
          <div className="pb-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{a.included}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activity.included.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant specific info */}
          {activity.category === "restaurant" && (activity.cuisine || activity.schedule) && (
            <div className="pb-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activity.cuisine && (
                  <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-xl">
                    <ChefHat className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">{a.cuisine}</p>
                      <p className="text-sm text-gray-800 font-medium">{activity.cuisine}</p>
                    </div>
                  </div>
                )}
                {activity.schedule && (
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">{a.schedule}</p>
                      <p className="text-sm text-gray-800 font-medium">{activity.schedule}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t.listing.location}</h2>
            <div className="flex items-start gap-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <span>{activity.address}, {activity.city}, Oriental, Maroc</span>
            </div>
            <div className="bg-gray-100 rounded-xl h-40 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-sm">{activity.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <ActivityBookingForm activity={activity} />
          </div>
        </div>
      </div>
    </div>
  );
}
