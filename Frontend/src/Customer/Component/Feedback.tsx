import { useEffect, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { useAppSelector } from "../../Redux/hooks";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_RESTAURANT_REVIEWS } from "../../graphql/Query";
import {
  SUBMIT_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
} from "../../graphql/Mutation";
import type {
  DeleteReview_Mutation_Interface,
  GetRestaurantReviews_Query_Interface,
  SubmitReview_Mutation_Interface,
  SubmitReview_Vars,
  UpdateReview_Mutation_Interface,
  UpdateReview_Vars,
} from "../../graphql/Client";

interface Prop {
  restaurantId: number;
  onRatingChange: (rating: number) => void;
}

export default function Feedback({ restaurantId, onRatingChange }: Prop) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [ratingNum, setRatingNum] = useState<null | number>(null);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<null | number>(null);
  const [editComment, setEditComment] = useState("");

  const { user } = useAppSelector((state) => state.auth);

  const { data, loading, error, refetch } = useQuery<
    GetRestaurantReviews_Query_Interface,
    { restaurantId: string }
  >(GET_RESTAURANT_REVIEWS, {
    variables: { restaurantId: String(restaurantId) },
    skip: !reviewOpen,
  });

  const [submitReview, { loading: submitting }] = useMutation<
    SubmitReview_Mutation_Interface,
    SubmitReview_Vars
  >(SUBMIT_REVIEW, {
    onCompleted: (res) => {
      if (res.SubmitReview.success) {
        setRatingNum(null);
        setComment("");
        refetch();
      }
    },
  });

  const [updateReview, { loading: updating }] = useMutation<
    UpdateReview_Mutation_Interface,
    UpdateReview_Vars
  >(UPDATE_REVIEW, {
    onCompleted: (res) => {
      if (res.UpdateReview.success) {
        setEditingReviewId(null);
        refetch();
      }
    },
  });

  const [deleteReview, { loading: deleting }] = useMutation<
    DeleteReview_Mutation_Interface,
    { reviewId: string }
  >(DELETE_REVIEW, {
    onCompleted: (res) => {
      if (res.DeleteReview.success) {
        refetch();
      }
    },
  });

  const reviews = data?.GetRestaurantReviews ?? [];

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    onRatingChange(avgRating);
  }, [avgRating, onRatingChange]);

  const myReview = user
    ? reviews.find((r) => r.user.id === user.id)
    : undefined;

  const handleSubmit = async () => {
    if (!ratingNum) return;
    try {
      await submitReview({
        variables: {
          input: {
            restaurantId: String(restaurantId),
            rating: ratingNum,
            comment: comment.trim() || null,
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (
    reviewId: string,
    rating: number,
    currentComment: string | null,
  ) => {
    setEditingReviewId(reviewId);
    setEditRating(rating);
    setEditComment(currentComment ?? "");
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(null);
    setEditComment("");
  };

  const handleUpdate = async (reviewId: string) => {
    if (!editRating) return;
    try {
      await updateReview({
        variables: {
          input: {
            reviewId,
            rating: editRating,
            comment: editComment.trim() || null,
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview({ variables: { reviewId } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto mt-8 px-6">
      <div className="bg-[#1d1816] rounded-2xl overflow-hidden border border-[#2a2421]">
        <div className="w-full flex items-center justify-between px-6 py-5 hover:bg-[#25201d] transition">
          <div>
            <h2 className="text-2xl font-bold text-left flex items-center gap-1.5">
              {!reviewOpen && (
                <span className="text-amber-400">
                  <FaStar />
                </span>
              )}
              Reviews & Ratings
              {reviews.length > 0 && (
                <span className="text-amber-400 text-base font-normal ml-2">
                  {avgRating.toFixed(1)}
                </span>
              )}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              See what customers are saying
            </p>
          </div>

          <span
            className="text-2xl cursor-pointer"
            onClick={() => setReviewOpen(!reviewOpen)}
          >
            {reviewOpen ? (
              <IoIosArrowDropdownCircle />
            ) : (
              <IoIosArrowDropupCircle />
            )}
          </span>
        </div>

        {reviewOpen && (
          <div className="border-t border-[#2a2421] p-6 space-y-8">
            {user?.role === "CUSTOMER" && !myReview && (
              <div className="bg-[#25201d] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Write a Review</h3>

                <div className="flex gap-2 text-3xl mb-4 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      className={`hover:text-amber-400 ${
                        ratingNum && num <= ratingNum
                          ? "text-amber-400"
                          : "text-amber-200"
                      }`}
                      key={num}
                      onClick={() => setRatingNum(num)}
                    >
                      <FaStar />
                    </span>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full h-20 rounded-xl bg-[#181514] p-4 outline-none resize-none"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!ratingNum || submitting}
                  className="mt-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition px-6 py-3 rounded-xl font-semibold"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}

            <div className="space-y-5">
              {loading && (
                <p className="text-gray-400 text-sm">Loading reviews...</p>
              )}
              {error && (
                <p className="text-red-400 text-sm">Couldn't load reviews.</p>
              )}
              {!loading && reviews.length === 0 && (
                <p className="text-gray-400 text-sm">
                  No reviews yet. Be the first to leave one!
                </p>
              )}

              {reviews.map((review) => {
                const isMine = user?.id === review.user.id;
                const isEditing = editingReviewId === review.id;

                return (
                  <div
                    key={review.id}
                    className="bg-[#25201d] rounded-xl p-5 relative"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold">
                          {review.user.firstname} {review.user.lastname}
                        </h4>

                        {isEditing ? (
                          <div className="flex gap-1 text-2xl mt-1 cursor-pointer">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <span
                                key={num}
                                className={
                                  editRating && num <= editRating
                                    ? "text-amber-400"
                                    : "text-amber-200"
                                }
                                onClick={() => setEditRating(num)}
                              >
                                <FaStar />
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-yellow-400 mt-1 flex gap-1">
                            {new Array(review.rating)
                              .fill(0)
                              .map((_, index) => (
                                <FaStar key={index} />
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full h-16 mt-4 rounded-xl bg-[#181514] p-3 outline-none resize-none text-gray-300"
                        />
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() => handleUpdate(review.id)}
                            disabled={!editRating || updating}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 transition px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            {updating ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-[#181514] hover:bg-[#302a26] transition px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {review.comment && (
                          <p className="text-gray-300 mt-4 leading-7">
                            {review.comment}
                          </p>
                        )}

                        {isMine && (
                          <div className="flex justify-end gap-5 mt-4 absolute right-10 top-5">
                            <button
                              onClick={() =>
                                startEdit(
                                  review.id,
                                  review.rating,
                                  review.comment,
                                )
                              }
                              className="text-sm text-gray-400 hover:text-amber-400 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              disabled={deleting}
                              className="text-sm text-gray-400 hover:text-red-400 transition disabled:opacity-50"
                            >
                              {deleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
