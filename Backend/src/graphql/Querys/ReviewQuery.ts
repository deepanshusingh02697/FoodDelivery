import { Arg, ID, Query, Resolver } from "type-graphql";
import { Review } from "../../entity/review.entity.js";
import { reviewRepository } from "../../repositories/repository.js";

@Resolver()
export class ReviewQuery {
  @Query(() => [Review])
  async GetRestaurantReviews(
    @Arg("restaurantId", () => ID) restaurantId: string,
  ): Promise<Review[]> {
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