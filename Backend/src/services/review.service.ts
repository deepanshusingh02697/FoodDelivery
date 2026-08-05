import { Context, isAuth } from "../middleware/context.js";
import {
  restaurantRepository,
  reviewRepository,
} from "../repositories/repository.js";
import { SubmitReviewInput, UpdateReviewInput } from "../Input/review.input.js";

export class ReviewService {
  async SubmitReview(input: SubmitReviewInput, ctx: Context) {
    isAuth(ctx);

    if (input.rating < 1 || input.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const restaurant = await restaurantRepository.findOne({
      where: {
        id: Number(input.restaurantId),
      },
    });

    if (!restaurant) {
      throw new Error("NOT_FOUND");
    }

    const existing = await reviewRepository.findOne({
      where: {
        userId: ctx.userId!,
        restaurantId: restaurant.id,
      },
    });

    if (existing) {
      throw new Error("You've already reviewed this restaurant");
    }

    const review = reviewRepository.create({
      rating: input.rating,
      comment: input.comment,
      userId: ctx.userId!,
      restaurantId: restaurant.id,
    });

    const savedReview = await reviewRepository.save(review);

    const fullReview = await reviewRepository.findOne({
      where: {
        id: savedReview.id,
      },
      relations: {
        user: true,
      },
    });

    return {
      success: true,
      msg: "Review submitted",
      review: fullReview,
    };
  }

  async UpdateReview(input: UpdateReviewInput, ctx: Context) {
    isAuth(ctx);

    const existing = await reviewRepository.findOne({
      where: {
        id: Number(input.reviewId),
      },
    });

    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    if (existing.userId !== ctx.userId) {
      throw new Error("Not your review");
    }

    if (input.rating !== undefined && (input.rating < 1 || input.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (input.rating !== undefined) {
      existing.rating = input.rating;
    }

    if (input.comment !== undefined) {
      existing.comment = input.comment;
    }

    const savedReview = await reviewRepository.save(existing);

    const updated = await reviewRepository.findOne({
      where: {
        id: savedReview.id,
      },
      relations: {
        user: true,
      },
    });

    return {
      success: true,
      msg: "Review updated",
      review: updated,
    };
  }

  async DeleteReview(reviewId: number, ctx: Context) {
    isAuth(ctx);

    const existing = await reviewRepository.findOne({
      where: {
        id: Number(reviewId),
      },
    });

    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    if (existing.userId !== ctx.userId) {
      throw new Error("Not your review");
    }

    await reviewRepository.remove(existing);

    return {
      success: true,
      msg: "Review deleted",
      review: null,
    };
  }

  async GetRestaurantReviews(restaurantId: string) {
    return await reviewRepository.find({
      where: {
        restaurantId: Number(restaurantId),
      },

      relations: {
        user: true,
      },

      order: {
        createdAt: "DESC",
      },
    });
  }
}
