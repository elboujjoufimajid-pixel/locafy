"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import AdminSidebar from "@/components/AdminSidebar";
import { Save, Loader2, CheckCircle, Shield, Mail, Lock, Globe } from "lucide-react";

export default function AdminSettings() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin/login"); return; }
    fetch("/api/db/admin-settings")
      .then((r) => r.json())
      .then((data) => { setEmail(data.email || ""); setPassword(data.password || ""); setReady(true); });
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword && newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    const finalPassword = newPassword || password;
    await fetch("/api/db/admin-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: finalPassword }),
    });
    setPassword(finalPassword);
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!ready) return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar />
      <main className="md:ml-60 pt-14 md:pt-0 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar />
      <main className="md:ml-60 pt-14 md:pt-0">
        <div className="px-6 py-8 max-w-3xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-500 text-sm mt-1">Configuration du panneau d&apos;administration</p>
          </div>

          <div className="space-y-5">

            {/* Admin credentials */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Identifiants Admin</p>
                  <p className="text-xs text-gray-400">Email et mot de passe de connexion</p>
                </div>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    Email de connexion
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Laisser vide pour ne pas changer"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      Confirmer
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Répéter le mot de passe"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-gray-400">Les changements prennent effet immédiatement</p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                    ) : saved ? (
                      <><CheckCircle className="w-4 h-4" /> Enregistré !</>
                    ) : (
                      <><Save className="w-4 h-4" /> Enregistrer</>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Site info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Informations du site</p>
                  <p className="text-xs text-gray-400">Détails de la plateforme</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Nom du site", value: "Rachra.com" },
                  { label: "URL", value: "https://rachra.com" },
                  { label: "Email contact", value: "contact@rachra.com" },
                  { label: "WhatsApp", value: "+212 600 287 382" },
                  { label: "Commission", value: "10%" },
                  { label: "IBAN CIH", value: "MA64230500283457821101640061" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900 font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
