export const ADMIN_EMAIL = "admin@rachra.com";
export const ADMIN_PASSWORD = "admin2026";
const KEY = "Rachra_admin_auth";

export function adminLogin(email: string, password: string): boolean {
  if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (typeof window !== "undefined") localStorage.setItem(KEY, "true");
    return true;
  }
  return false;
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "true";
}

export function adminLogout() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
