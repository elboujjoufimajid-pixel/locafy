"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { userLogin } from "@/lib/userAuth";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"client" | "owner">("client");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    userLogin(form.email, `${form.firstName} ${form.lastName}`, form.phone, role);
    router.push("/dashboard");
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role selector */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Je suis</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
              role === "client"
                ? "border-blue-600 bg-blue-50 text-blue-800"
                : "border-gray-200 text-gray-600"
            }`}
          >
            🏠 Locataire
          </button>
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
              role === "owner"
                ? "border-blue-600 bg-blue-50 text-blue-800"
                : "border-gray-200 text-gray-600"
            }`}
          >
            🔑 Propriétaire
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Prénom</label>
          <input
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            placeholder="Mohamed"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom</label>
          <input
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            placeholder="Benali"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="vous@email.com"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Téléphone</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="06 XX XX XX XX"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Mot de passe</label>
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            required
            minLength={8}
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPwd(!showPwd)}
          >
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Minimum 8 caractères</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Création du compte...
          </>
        ) : (
          "Créer mon compte"
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        En vous inscrivant, vous acceptez nos{" "}
        <a href="#" className="text-blue-700">Conditions d&apos;utilisation</a>
      </p>

      <div className="relative my-2">
        <hr className="border-gray-100" />
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-400">ou continuer avec</span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full border border-gray-200 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </button>
    </form>
  );
}

