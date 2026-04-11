"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userLogin } from "@/lib/userAuth";
import { Loader2 } from "lucide-react";

function GoogleSuccessInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const firstName = params.get("firstName") || "Utilisateur";
    const lastName = params.get("lastName") || "";
    const email = params.get("email") || "";
    const callback = params.get("callback") || "/dashboard";

    if (email) {
      userLogin(email, `${firstName} ${lastName}`.trim(), "", "client");
    }

    router.replace(callback);
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-gray-600 text-sm">Connexion en cours...</p>
      </div>
    </div>
  );
}

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <GoogleSuccessInner />
    </Suspense>
  );
}
