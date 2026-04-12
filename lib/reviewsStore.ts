const KEY = "Rachra_reviews";

export interface Review {
  id: string;
  listingId: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export function getReviews(listingId: string): Review[] {
  if (typeof window === "undefined") return [];
  const s = localStorage.getItem(KEY);
  const all: Review[] = s ? JSON.parse(s) : [];
  return all.filter((r) => r.listingId === listingId);
}

export function addReview(review: Omit<Review, "id" | "date">): Review {
  const s = localStorage.getItem(KEY);
  const all: Review[] = s ? JSON.parse(s) : [];
  const newReview: Review = {
    ...review,
    id: `rev_${Date.now()}`,
    date: new Date().toLocaleDateString("fr-MA", { year: "numeric", month: "long" }),
  };
  all.unshift(newReview);
  localStorage.setItem(KEY, JSON.stringify(all));
  return newReview;
}
