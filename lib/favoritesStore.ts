const KEY = "Rachra_favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  const s = localStorage.getItem(KEY);
  return s ? JSON.parse(s) : [];
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(id);
  }
  localStorage.setItem(KEY, JSON.stringify(favs));
  return idx < 0; // true = added
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}
