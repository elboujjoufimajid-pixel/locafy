"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12v4m0 0l-2-2m2 2l2-2" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pas de connexion</h1>
      <p className="text-gray-500 text-sm max-w-xs mb-6">
        Vous êtes hors ligne. Reconnectez-vous à internet pour continuer à utiliser Rachra.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
