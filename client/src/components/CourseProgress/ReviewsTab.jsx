import React from "react";
import { Star, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const StarRating = ({ rating, size = "h-4 w-4" }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${
            i <= Math.round(rating)
              ? "text-yellow-500 fill-current"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewsTab = ({
  reviews,
  averageRating,
  totalReviews,
  distribution,
  reviewHover,
  setReviewHover,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  reviewMutation,
  deleteReviewMutation,
  user,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Review Header & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white/5 border border-white/10 rounded-[40px] p-10">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tighter">
            Course Reviews
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-6xl font-black text-white">
              {averageRating}
            </div>
            <div>
              <StarRating rating={averageRating} size="h-6 w-6" />
              <p className="text-gray-500 text-xs font-bold mt-1 uppercase tracking-widest">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-4">
              <span className="text-[11px] font-black text-gray-500 w-4">
                {star}
              </span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                  style={{
                    width: `${totalReviews > 0 ? ((distribution[star] || 0) / totalReviews) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-500 w-8 text-right">
                {distribution[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Review Form */}
      <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[32px] space-y-6">
        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Share your experience
        </h3>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setReviewHover(star)}
              onMouseLeave={() => setReviewHover(0)}
              onClick={() => setReviewRating(star)}
              className="transition-transform hover:scale-125 duration-300"
            >
              <Star
                className={`h-10 w-10 cursor-pointer transition-colors ${
                  star <= (reviewHover || reviewRating)
                    ? "text-yellow-500 fill-current"
                    : "text-white/10"
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder="Tell other students what you thought of this course..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:ring-2 focus:ring-blue-600 outline-none min-h-[120px] transition-all"
        />

        <Button
          onClick={() => {
            if (reviewRating === 0)
              return toast.error("Please pick a star rating!");
            reviewMutation.mutate({
              rating: reviewRating,
              comment: reviewComment,
            });
          }}
          disabled={reviewMutation.isPending || reviewRating === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-14 px-10 transition-all shadow-xl shadow-blue-900/40"
        >
          {reviewMutation.isPending ? "Submitting..." : "Post Review"}
        </Button>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/5 border-dashed">
            <Star className="h-12 w-12 text-white/5 mx-auto mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              No reviews for this course yet
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-4 hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {review.userId?.profilePicture ? (
                      <img
                        src={review.userId.profilePicture}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-black text-gray-600">
                        {review.userId?.name?.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-black text-white">
                      {review.userId?.name || "Anonymous Student"}
                    </div>
                    <StarRating rating={review.rating} size="h-3 w-3" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {review.comment}
              </p>
              {user?._id === review.userId?._id && (
                <Button
                  variant="ghost"
                  onClick={() => deleteReviewMutation.mutate()}
                  className="h-8 text-[10px] font-black uppercase text-red-500/50 hover:text-red-500 hover:bg-red-500/10 px-4 rounded-lg"
                >
                  <Trash2 className="h-3 w-3 mr-2" /> Delete My Review
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
