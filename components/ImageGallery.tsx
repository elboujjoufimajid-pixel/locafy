"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 md:h-96 rounded-2xl overflow-hidden">
        {/* Main image */}
        <div
          className="col-span-4 md:col-span-2 md:row-span-2 relative cursor-pointer group"
          onClick={() => { setCurrent(0); setLightbox(true); }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:brightness-90 transition"
          />
        </div>

        {/* Secondary images */}
        {images.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="hidden md:block relative cursor-pointer group"
            onClick={() => { setCurrent(i + 1); setLightbox(true); }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${title} ${i + 2}`}
              className="w-full h-full object-cover group-hover:brightness-90 transition"
            />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                +{images.length - 5} photos
              </div>
            )}
          </div>
        ))}

        {/* Fill empty slots */}
        {Array.from({ length: Math.max(0, 4 - images.slice(1, 5).length) }).map((_, i) => (
          <div key={`empty-${i}`} className="hidden md:block bg-gray-100" />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setLightbox(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[current]}
            alt={title}
            className="max-h-[80vh] max-w-full object-contain rounded-lg"
          />
          <button
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setCurrent((c) => (c + 1) % images.length)}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-4 text-white/60 text-sm">
            {current + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

