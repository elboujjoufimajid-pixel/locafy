"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Users, Tag } from "lucide-react";
import type { GroupOuting } from "@/lib/data";
import { joinOuting, leaveOuting, isJoined } from "@/lib/groupOutingsStore";
import { getCurrentUser } from "@/lib/userAuth";
import { formatPrice } from "@/lib/utils";

interface Props {
  outing: GroupOuting;
  onUpdate?: () => void;
}

const categoryConfig: Record<string, { emoji: string; label: string; color: string }> = {
  plage:     { emoji: "🏖️", label: "Plage",      color: "bg-cyan-100 text-cyan-700" },
  randonnee: { emoji: "🥾", label: "Randonnée",  color: "bg-green-100 text-green-700" },
  resto:     { emoji: "🍕", label: "Resto",       color: "bg-orange-100 text-orange-700" },
  roadtrip:  { emoji: "🚗", label: "Road Trip",   color: "bg-yellow-100 text-yellow-700" },
  gaming:    { emoji: "🎮", label: "Gaming",      color: "bg-purple-100 text-purple-700" },
  sport:     { emoji: "⚽", label: "Sport",       color: "bg-red-100 text-red-700" },
  autre:     { emoji: "✨", label: "Autre",       color: "bg-gray-100 text-gray-700" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

export default function GroupOutingCard({ outing, onUpdate }: Props) {
  const cat = categoryConfig[outing.category] ?? categoryConfig.autre;
  const spotsLeft = outing.maxParticipants - outing.participants.length;
  const isFull = spotsLeft <= 0;
  const fillPct = Math.round((outing.participants.length / outing.maxParticipants) * 100);

  const userKey = (() => {
    if (typeof window === "undefined") return "";
    const u = getCurrentUser();
    return u?.email || localStorage.getItem("Rachra_anonId") || (() => {
      const id = `anon_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("Rachra_anonId", id);
      return id;
    })();
  });

  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(outing.participants.length);

  useEffect(() => {
    setJoined(isJoined(outing.id, userKey()));
    setCount(outing.participants.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outing.id]);

  function handleJoin(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const key = userKey();
    if (joined) {
      leaveOuting(outing.id, key);
      setJoined(false);
      setCount((c) => c - 1);
    } else {
      if (joinOuting(outing.id, key)) {
        setJoined(true);
        setCount((c) => c + 1);
      }
    }
    onUpdate?.();
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        {outing.image && (
          <div className="relative sm:w-44 h-44 sm:h-auto shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={outing.image}
              alt={outing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cat.color}`}>
                {cat.emoji} {cat.label}
              </span>
            </div>
            {outing.price === 0 && (
              <div className="absolute top-2 right-2">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Gratuit</span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{outing.title}</h3>
              <p className="text-gray-500 text-xs line-clamp-2">{outing.description}</p>
            </div>
            {/* Organizer avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0" title={outing.organizer.name}>
              {outing.organizer.avatar}
            </div>
          </div>

          {/* Info row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              {formatDate(outing.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {outing.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {outing.city}
            </span>
          </div>

          {/* Meeting point */}
          <p className="text-xs text-gray-400 flex items-start gap-1">
            <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-gray-300" />
            <span className="line-clamp-1">{outing.meetingPoint}</span>
          </p>

          {/* Tags */}
          {outing.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {outing.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full text-gray-500 flex items-center gap-0.5">
                  <Tag className="w-2.5 h-2.5" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Participants bar + button */}
          <div className="mt-auto flex items-end justify-between gap-4 pt-1">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {count}/{outing.maxParticipants} participants
                </span>
                {!isFull && (
                  <span className={`text-xs font-semibold ${spotsLeft <= 3 ? "text-red-600" : "text-green-600"}`}>
                    {spotsLeft <= 3 ? `Plus que ${spotsLeft} place${spotsLeft > 1 ? "s" : ""} !` : `${spotsLeft} places libres`}
                  </span>
                )}
                {isFull && <span className="text-xs font-semibold text-red-600">Complet</span>}
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all ${fillPct >= 90 ? "bg-red-500" : fillPct >= 60 ? "bg-orange-400" : "bg-green-500"}`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {outing.price > 0 && (
                <span className="text-sm font-bold text-blue-700">{formatPrice(outing.price)}<span className="text-xs text-gray-400 font-normal">/pers</span></span>
              )}
              <button
                onClick={handleJoin}
                disabled={isFull && !joined}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  joined
                    ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                    : isFull
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
              >
                {joined ? "Quitter" : isFull ? "Complet" : "Rejoindre"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
