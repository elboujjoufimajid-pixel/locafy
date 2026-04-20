"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Grid2X2 } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  const open = (i: number) => { setCurrent(i); setLightbox(true); };

  return (
    <>
      {/* Grid */}
      <div className="relative grid grid-cols-4 grid-rows-2 gap-2 h-72 md:h-[420px] rounded-2xl overflow-hidden">
        {/* Main image */}
        <div className="col-span-4 md:col-span-2 md:row-span-2 relative cursor-pointer group" onClick={() => open(0)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={title} className="w-full h-full object-cover group-hover:brightness-90 transition duration-300" />
        </div>

        {/* Secondary images */}
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="hidden md:block relative cursor-pointer group overflow-hidden" onClick={() => open(i + 1)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`${title} ${i + 2}`} className="w-full h-full object-cover group-hover:brightness-90 group-hover:scale-105 transition duration-300" />
            {/* Last image overlay */}
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                +{images.length - 5} photos
              </div>
            )}
          </div>
        ))}

        {/* Fill empty grid slots */}
        {Array.from({ length: Math.max(0, 4 - images.slice(1, 5).length) }).map((_, i) => (
          <div key={`e-${i}`} className="hidden md:block bg-gray-100" />
        ))}

        {/* "Voir toutes les photos" button */}
        <button
          onClick={() => open(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded-xl shadow-md transition-all hover:shadow-lg z-10"
        >
          <Grid2X2 className="w-4 h-4" />
          Voir toutes les photos
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col" onClick={() => setLightbox(false)}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0" onClick={(e) => e.stopPropagation()}>
            <p className="text-white font-semibold truncate max-w-xs">{title}</p>
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm">{current + 1} / {images.length}</span>
              <button onClick={() => setLightbox(false)} className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center px-16 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={prev} className="absolute left-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft className="w-8 h-8" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[current]}
              alt={`${title} ${current + 1}`}
              className="max-h-full max-w-full object-contain rounded-xl select-none"
              style={{ maxHeight: "calc(100vh - 220px)" }}
            />
            <button onClick={next} className="absolute right-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Thumbnails strip */}
          <div className="shrink-0 px-6 py-4 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === current ? "border-white opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
