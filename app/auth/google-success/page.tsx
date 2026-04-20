"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userLogin, getMembers } from "@/lib/userAuth";
import { Loader2 } from "lucide-react";

function GoogleSuccessInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const firstName = params.get("firstName") || "Utilisateur";
    const lastName = params.get("lastName") || "";
    const email = params.get("email") || "";
    const callback = params.get("callback") || "/";

    if (!email) { router.replace(callback); return; }

    // Check if new user (not already registered)
    const members = getMembers();
    const isNew = !members.find((m) => m.email === email);

    userLogin(email, `${firstName} ${lastName}`.trim(), "", "client");

    // Send welcome email only for new users
    if (isNew) {
      fetch("/api/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, role: "client" }),
      }).catch(() => {});
    }

    router.replace(callback);
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
        <p className="text-gray-700 font-medium">Connexion en cours...</p>
        <p className="text-gray-400 text-sm mt-1">Vous allez être redirigé</p>
      </div>
    </div>
  );
}

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <GoogleSuccessInner />
    </Suspense>
  );
}
