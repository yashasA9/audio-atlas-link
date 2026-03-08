import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Loader2, User, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface TrackReviewsProps {
  trackId: string;
  trackTitle: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState(0);
  const px = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
        >
          <Star
            className={`${px} ${
              star <= (hover || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function TrackReviews({ trackId, trackTitle }: TrackReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [avgRating, setAvgRating] = useState(0);

  const fetchReviews = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, user_id, rating, comment, created_at")
      .eq("track_id", trackId)
      .order("created_at", { ascending: false });

    if (!data) {
      setLoading(false);
      return;
    }

    // Fetch profile names for each reviewer
    const userIds = [...new Set(data.map((r) => r.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const enriched: Review[] = data.map((r) => ({
      ...r,
      display_name: profileMap.get(r.user_id)?.display_name || "Anonymous",
      avatar_url: profileMap.get(r.user_id)?.avatar_url || null,
    }));

    setReviews(enriched);
    if (enriched.length > 0) {
      setAvgRating(enriched.reduce((s, r) => s + r.rating, 0) / enriched.length);
    }
    setLoading(false);
  }, [trackId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to leave a review");
      return;
    }
    if (!isValidUUID) {
      toast.error("Reviews are only available for published tracks");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    const trimmed = comment.trim();
    if (trimmed.length > 500) {
      toast.error("Comment must be under 500 characters");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").upsert(
      {
        user_id: user.id,
        track_id: trackId,
        rating,
        comment: trimmed || null,
      },
      { onConflict: "user_id,track_id" }
    );

    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      fetchReviews();
    }
    setSubmitting(false);
  };

  const handleDelete = async (reviewId: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) {
      toast.error("Failed to delete review");
    } else {
      toast.success("Review deleted");
      fetchReviews();
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-3">
        <h3 className="font-display text-lg font-bold text-foreground">Reviews</h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avgRating)} readonly size="sm" />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Submit form */}
      {user ? (
        <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Your rating:</span>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment (optional)..."
              maxLength={500}
              className="flex-1 px-3 py-2 rounded-lg surface border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-transparent"
            />
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Post
            </button>
          </div>
        </form>
      ) : (
        <div className="glass-card p-4 text-center text-sm text-muted-foreground">
          Sign in to leave a review
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No reviews yet — be the first!</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card p-4 flex gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 overflow-hidden">
                  {review.avatar_url ? (
                    <img src={review.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{review.display_name}</span>
                    <StarRating value={review.rating} readonly size="sm" />
                    <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                  )}
                </div>
                {user?.id === review.user_id && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
