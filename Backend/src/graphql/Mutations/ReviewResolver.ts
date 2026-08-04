import { Arg, Ctx, ID, Int, Mutation, Resolver } from "type-graphql";
import { Context, isAuth } from "../../../graphql/context.js";
import {
  restaurantRepository,
  reviewRepository,
} from "../../repositories/repository.js";
import { ReviewResponse } from "../../Types/ReviewResponse.js";

@Resolver()
export class ReviewResolver {
  @Mutation(() => ReviewResponse)
  async SubmitReview(
    @Arg("restaurantId", () => ID) restaurantId: number,
    @Arg("rating", () => Int) rating: number,
    @Arg("comment", () => String, { nullable: true })
    comment: string | undefined,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const restaurant = await restaurantRepository.findOne({
      where: {
        id: Number(restaurantId),
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
      rating: rating,
      comment: comment,
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
  @Mutation(() => ReviewResponse)
  async UpdateReview(
    @Arg("reviewId", () => ID) reviewId: string,
    @Arg("rating", () => Int, { nullable: true }) rating: number | undefined,
    @Arg("comment", () => String, { nullable: true })
    comment: string | undefined,
    @Ctx() ctx: Context,
  ) {
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

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (rating !== undefined) {
      existing.rating = rating;
    }

    if (comment !== undefined) {
      existing.comment = comment;
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
  @Mutation(() => ReviewResponse)
  async DeleteReview(
    @Arg("reviewId", () => ID) reviewId: number,
    @Ctx() ctx: Context,
  ) {
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
}
