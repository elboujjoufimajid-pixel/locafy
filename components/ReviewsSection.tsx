"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getReviews, addReview, type Review } from "@/lib/reviewsStore";
import { getCurrentUser } from "@/lib/userAuth";

export default function ReviewsSection({ listingId }: { listingId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setReviews(getReviews(listingId));
  }, [listingId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = getCurrentUser();
    const newReview = addReview({
      listingId,
      author: user ? `${user.firstName} ${user.lastName}` : "Visiteur",
      avatar: user ? `${user.firstName[0]}${user.lastName?.[0] || ""}` : "V",
      rating,
      comment,
    });
    setReviews([newReview, ...reviews]);
    setComment("");
    setRating(5);
    setShowForm(false);
  }

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">Avis clients</h2>
          {avg && (
            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-blue-800">{avg}</span>
              <span className="text-xs text-gray-500">({reviews.length} avis)</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          + Laisser un avis
        </button>
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-blue-50 rounded-2xl p-5 mb-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Note</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((s) => (
                <button key={s} type="button"
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(s)}
                >
                  <Star className={`w-7 h-7 transition-colors ${s <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Commentaire</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              required
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-600 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
            <button type="submit" className="flex-1 bg-blue-700 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-800">Publier</button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          Aucun avis pour l'instant — soyez le premier !
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                  {r.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{r.author}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
