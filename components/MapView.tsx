"use client";

import { useEffect, useRef } from "react";
import type { Listing } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

interface Props {
  listings: Listing[];
  onSelect?: (id: string) => void;
}

export default function MapView({ listings, onSelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const withCoords = listings.filter((l) => l.lat && l.lng);
    if (withCoords.length === 0) return;

    import("leaflet").then((L) => {
      // Fix default marker icon
      // @ts-expect-error leaflet internal
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const centerLat = withCoords.reduce((s, l) => s + (l.lat ?? 0), 0) / withCoords.length;
      const centerLng = withCoords.reduce((s, l) => s + (l.lng ?? 0), 0) / withCoords.length;

      const map = L.map(mapRef.current!).setView([centerLat, centerLng], 6);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      withCoords.forEach((listing) => {
        const priceLabel = L.divIcon({
          className: "",
          html: `<div style="background:#003580;color:white;padding:4px 8px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;">
            ${formatPrice(listing.pricePerDay)}
          </div>`,
          iconAnchor: [40, 16],
        });

        const marker = L.marker([listing.lat!, listing.lng!], { icon: priceLabel }).addTo(map);

        marker.bindPopup(`
          <div style="min-width:200px">
            <img src="${listing.images[0]}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:6px"/>
            <strong style="font-size:13px">${listing.title}</strong><br/>
            <span style="font-size:12px;color:#555">${listing.city}</span><br/>
            <span style="font-size:13px;font-weight:700;color:#003580">${formatPrice(listing.pricePerDay)}/nuit</span>
          </div>
        `);

        marker.on("click", () => {
          onSelect?.(listing.id);
        });
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} style={{ width: "100%", height: "500px", borderRadius: "16px" }} />
    </>
  );
}
