const KEY = "Rachra_recentlyViewed";
const MAX = 6;

export function addRecentlyViewed(id: string) {
  if (typeof window === "undefined") return;
  const ids: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
  const filtered = ids.filter((i) => i !== id);
  filtered.unshift(id);
  localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, MAX)));
}

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}
