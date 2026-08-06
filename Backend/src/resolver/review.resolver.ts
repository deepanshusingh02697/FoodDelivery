import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";

import { Context } from "../middleware/context.js";
import { SubmitReviewInput, UpdateReviewInput } from "../Input/review.input.js";
import { Review } from "../entity/review.entity.js";
import { ReviewService } from "../services/review.service.js";
import { ReviewResponse } from "../Types/ReviewResponse.js";

@Resolver()
export class ReviewResolver {
  private reviewService = new ReviewService();

  @Mutation(() => ReviewResponse)
  async SubmitReview(
    @Arg("input", () => SubmitReviewInput)
    input: SubmitReviewInput,

    @Ctx() ctx: Context,
  ) {
    return await this.reviewService.SubmitReview(input, ctx);
  }

  @Mutation(() => ReviewResponse)
  async UpdateReview(
    @Arg("input", () => UpdateReviewInput)
    input: UpdateReviewInput,

    @Ctx() ctx: Context,
  ) {
    return await this.reviewService.UpdateReview(input, ctx);
  }

  @Mutation(() => ReviewResponse)
  async DeleteReview(
    @Arg("reviewId", () => ID)
    reviewId: number,

    @Ctx() ctx: Context,
  ) {
    return await this.reviewService.DeleteReview(reviewId, ctx);
  }

  @Query(() => [Review])
  async GetRestaurantReviews(
    @Arg("restaurantId", () => ID)
    restaurantId: string,
  ): Promise<Review[]> {
    return await this.reviewService.GetRestaurantReviews(restaurantId);
  }
}
