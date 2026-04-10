// Simple client-side user auth for demo purposes

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "client" | "owner";
  joinedAt: string;
}

const USER_KEY = "locafy_user";

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
  if (typeof window !== "undefined") localStorage.removeItem(USER_KEY);
}

export function updateUserProfile(updates: Partial<UserProfile>): void {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, ...updates }));
}
