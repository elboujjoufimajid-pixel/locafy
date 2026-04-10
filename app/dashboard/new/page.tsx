import NewListingForm from "@/components/NewListingForm";

export default function NewListingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Publier une annonce</h1>
        <p className="text-gray-500 text-sm mt-1">
          Remplissez les informations de votre bien ou véhicule
        </p>
      </div>
      <NewListingForm />
    </div>
  );
}

