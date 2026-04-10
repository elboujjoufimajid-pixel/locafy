"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { userLogin } from "@/lib/userAuth";

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
    </form>
  );
}

