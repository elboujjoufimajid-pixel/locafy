const KEY = "Rachra_verified_reservations";

interface VerifiedReservation {
  listingId: string;
  email: string;
}

export function markReservationVerified(listingId: string, email: string) {
  if (typeof window === "undefined") return;
  const s = localStorage.getItem(KEY);
  const all: VerifiedReservation[] = s ? JSON.parse(s) : [];
  const exists = all.some((r) => r.listingId === listingId && r.email === email);
  if (!exists) {
    all.push({ listingId, email });
    localStorage.setItem(KEY, JSON.stringify(all));
  }
}

export function hasVerifiedReservation(listingId: string, email: string): boolean {
  if (typeof window === "undefined") return false;
  const s = localStorage.getItem(KEY);
  const all: VerifiedReservation[] = s ? JSON.parse(s) : [];
  return all.some((r) => r.listingId === listingId && r.email === email);
}
