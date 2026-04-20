const KEY = "Rachra_admin_auth";

// Hardcoded fallback — works even if Supabase is down
const FALLBACK_EMAIL = "admin@rachra.com";
const FALLBACK_PASSWORD = "Utrecht2007@";

export async function adminLogin(email: string, password: string): Promise<boolean> {
  const trimmedEmail = email.trim();

  // 1. Always check hardcoded credentials first (guaranteed to work)
  if (trimmedEmail === FALLBACK_EMAIL && password === FALLBACK_PASSWORD) {
    if (typeof window !== "undefined") localStorage.setItem(KEY, "true");
    return true;
  }

  // 2. Also check DB credentials (in case admin changed them via settings page)
  try {
    const res = await fetch("/api/db/admin-settings");
    if (res.ok) {
      const settings = await res.json();
      if (trimmedEmail === settings.email && password === settings.password) {
        if (typeof window !== "undefined") localStorage.setItem(KEY, "true");
        return true;
      }
    }
  } catch {
    // Supabase unreachable — fallback already handled above
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
