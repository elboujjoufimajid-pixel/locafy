"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n";

interface Props {
  cities: string[];
  current: {
    type?: string;
    city?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function ListingsFilters({ cities, current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useT();
  const [search, setSearch] = useState(current.search || "");
  const [minPrice, setMinPrice] = useState(current.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(current.maxPrice || "");

  const types = [
    { value: "all", label: t.filters.all },
    { value: "apartment", label: t.filters.apartments },
    { value: "house", label: t.filters.houses },
    { value: "car", label: t.filters.cars },
  ];

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    const all: Record<string, string> = {
      type: current.type || "all",
      city: current.city || "all",
      search: search,
      minPrice: minPrice,
      maxPrice: maxPrice,
      [key]: value,
    };
    Object.entries(all).forEach(([k, v]) => {
      if (v && v !== "all") params.set(k, v);
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (current.type && current.type !== "all") params.set("type", current.type);
    if (current.city && current.city !== "all") params.set("city", current.city);
    if (search) params.set("search", search);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">{t.filters.search}</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.filters.searchPlaceholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">{t.filters.type}</label>
        <div className="space-y-1.5">
          {types.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => update("type", type.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                (current.type || "all") === type.value
                  ? "bg-blue-50 text-blue-800 font-medium border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">{t.filters.city}</label>
        <select
          value={current.city || "all"}
          onChange={(e) => update("city", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
        >
          <option value="all">{t.filters.allCities}</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          {t.filters.pricePerDay}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={t.filters.min}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={t.filters.max}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
      >
        {t.filters.apply}
      </button>
    </form>
  );
}

