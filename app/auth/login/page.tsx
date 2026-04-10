"use client";

import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import { useT } from "@/lib/i18n";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const { t } = useT();
  const a = t.auth;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Logo size={40} />
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              locafy<span className="text-blue-600">.ma</span>
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-6 mb-1">{a.welcome}</h1>
          <p className="text-gray-500 text-sm">{a.loginSubtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <LoginForm />

          <div className="mt-4 text-center text-sm text-gray-500">
            {a.noAccount}{" "}
            <Link href="/auth/register" className="text-blue-700 font-medium hover:underline">
              {a.register}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

