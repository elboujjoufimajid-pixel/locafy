"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { filterListings } from "@/lib/adminStore";
import { CITIES } from "@/lib/data";
import ListingCard from "@/components/ListingCard";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ListingsFilters from "@/components/ListingsFilters";
import { useT } from "@/lib/i18n";
import { Suspense } from "react";

type SortKey = "recommended" | "priceAsc" | "priceDesc" | "rating";

function ListingsContent() {
  const searchParams = useSearchParams();
  const { t } = useT();
  const [sort, setSort] = useState<SortKey>("recommended");

  const params = {
    type: searchParams.get("type") || undefined,
    city: searchParams.get("city") || undefined,
    search: searchParams.get("search") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
  };

  let results = filterListings({
    type: params.type,
    city: params.city,
    search: params.search,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
  });

  // Sort
  results = [...results].sort((a, b) => {
    if (sort === "priceAsc") return a.pricePerDay - b.pricePerDay;
    if (sort === "priceDesc") return b.pricePerDay - a.pricePerDay;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  const l = t.listings;
  const typeLabel =
    params.type === "apartment" ? l.apartments
    : params.type === "house" ? l.houses
    : params.type === "car" ? l.cars
    : l.all;

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "recommended", label: l.sortRecommended },
    { key: "priceAsc", label: l.sortPriceAsc },
    { key: "priceDesc", label: l.sortPriceDesc },
    { key: "rating", label: l.sortRating },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{typeLabel}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {results.length} {results.length > 1 ? l.foundPlural : l.found}
          {params.city && params.city !== "all" ? ` ${l.in} ${params.city}` : ` ${l.inOriental}`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="w-4 h-4 text-blue-700" />
              <h2 className="font-semibold text-gray-900">{t.filters.search}</h2>
            </div>
            <ListingsFilters cities={CITIES} current={params} />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{results.length} {results.length > 1 ? l.foundPlural : l.found}</p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{l.sortBy} :</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-600 bg-white cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-medium text-lg text-gray-600">{l.noResults}</p>
              <p className="text-sm mt-2">{l.noResultsHint}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((listing) => (
                <ListingCard key={listing.id} listing={listing} horizontal={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-gray-400">Chargement...</div>}>
      <ListingsContent />
    </Suspense>
  );
}

