// Simple client-side user auth for demo purposes

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "client" | "owner";
  joinedAt: string;
}

const USER_KEY = "Rachra_user";
const MEMBERS_KEY = "Rachra_members";

export function getMembers(): UserProfile[] {
  if (typeof window === "undefined") return [];
  const s = localStorage.getItem(MEMBERS_KEY);
  return s ? JSON.parse(s) : [];
}

function saveMember(profile: UserProfile) {
  if (typeof window === "undefined") return;
  const all = getMembers();
  const exists = all.find((m) => m.email === profile.email);
  if (!exists) {
    all.unshift(profile);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(all));
  }
}

export function userLogin(email: string, name?: string, phone?: string, role?: "client" | "owner"): void {
  if (typeof window === "undefined") return;
  const existing = getCurrentUser();
  if (existing && existing.email === email) return;
  const parts = (name || email.split("@")[0]).split(" ");
  const profile: UserProfile = {
    firstName: parts[0] || "Utilisateur",
    lastName: parts.slice(1).join(" ") || "",
    email,
    phone: phone || "",
    role: role || "client",
    joinedAt: new Date().toISOString(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
  saveMember(profile);
  window.dispatchEvent(new Event("rachra_auth_change"));
  // Also register in Supabase DB
  fetch("/api/db/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  }).catch(() => {});
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem(USER_KEY);
  return s ? JSON.parse(s) : null;
}

export function isUserLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function userLogout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("rachra_auth_change"));
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): void {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, ...updates }));
}
