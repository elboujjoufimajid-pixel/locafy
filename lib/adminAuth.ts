export const ADMIN_EMAIL = "admin@locafy.ma";
export const ADMIN_PASSWORD = "admin2026";
const KEY = "locafy_admin_auth";

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
