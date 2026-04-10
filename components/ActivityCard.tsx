"use client";

import Link from "next/link";
import { MapPin, Clock, Users, Star } from "lucide-react";
import type { Activity } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface Props {
  activity: Activity;
}

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

const idealForEmojis = {
  family: "👨‍👩‍👧‍👦",
  couple: "💑",
  group: "👥",
  solo: "🧍",
};

export default function ActivityCard({ activity }: Props) {
  const { t } = useT();
  const a = t.activities;
  const discountedPrice = activity.deal
    ? Math.round(activity.pricePerPerson * (1 - activity.deal / 100))
    : null;

  return (
    <Link href={`/activities/${activity.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer border border-gray-100 flex h-44">
        {/* Image */}
        <div className="relative w-48 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activity.images[0]}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${categoryColors[activity.category]}`}>
              <span>{categoryEmojis[activity.category]}</span>
              {a.categoryLabels[activity.category]}
            </span>
          </div>
          {activity.deal && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{activity.deal}%
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
                {activity.title}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{activity.city}</span>
                <span className="mx-1">·</span>
                <Clock className="w-3 h-3 shrink-0" />
                <span>{activity.duration}</span>
                <span className="mx-1">·</span>
                <Users className="w-3 h-3 shrink-0" />
                <span>{activity.minPersons}–{activity.maxPersons} {a.minMax}</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {activity.idealFor.map((f) => (
                  <span key={f} className="text-xs bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded-full text-gray-600">
                    {idealForEmojis[f]} {a[f]}
                  </span>
                ))}
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-800">{activity.rating}</span>
              </div>
              <span className="text-xs text-gray-400">{activity.reviewCount} {t.card.reviews}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-auto flex items-end justify-between">
            <span className="text-xs text-blue-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              {a.freeCancellation}
            </span>
            <div className="text-right">
              {discountedPrice ? (
                <>
                  <span className="text-xs text-gray-400 line-through block">
                    {formatPrice(activity.pricePerPerson)}
                  </span>
                  <span className="text-blue-700 font-bold text-base">
                    {formatPrice(discountedPrice)}
                  </span>
                </>
              ) : (
                <span className="text-blue-700 font-bold text-base">
                  {formatPrice(activity.pricePerPerson)}
                </span>
              )}
              <span className="text-gray-400 text-xs">{a.perPerson}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
