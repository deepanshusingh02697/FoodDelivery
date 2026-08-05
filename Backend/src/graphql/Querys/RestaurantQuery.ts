import { Arg, Ctx, Float, Int, Query, Resolver } from "type-graphql";
import {
  Restaurant,
  RestaurantStatus,
} from "../../entity/restaurant.entity.js";
import { Context, isAdmin, isAuth } from "../../middleware/context.js";
import { restaurantRepository } from "../../repositories/repository.js";

@Resolver()
export class RestaurantQuery {
  @Query(() => [Restaurant])
  async GetPendingRestaurants(@Ctx() ctx: Context): Promise<Restaurant[]> {
    isAdmin(ctx);
    return await restaurantRepository.find({
      where: {
        status: RestaurantStatus.PENDING,
      },
      relations: {
        owner: true,
        admin: true,
      },
    });
  }
  @Query(() => [Restaurant])
  async FilterRestaurants(
    @Arg("search", () => String, { nullable: true }) search: string | undefined,
    @Arg("cuisine", () => String, { nullable: true })
    cuisine: string | undefined,
    @Arg("vegOnly", () => Boolean, { nullable: true })
    vegOnly: boolean | undefined,
    @Arg("rating", () => Float, { nullable: true })
    rating: number | undefined,
    @Ctx() ctx: Context,
  ): Promise<Restaurant[]> {
    isAuth(ctx);

    let restaurants = await restaurantRepository.find({
      where: {
        status: RestaurantStatus.APPROVED,
      },
      relations: {
        menus: true,
        reviews: true,
      },
    });

    if (search) {
      restaurants = restaurants.filter((restaurant) =>
        restaurant.restaurantName.toLowerCase().includes(search!.toLowerCase()),
      );
    }

    if (cuisine) {
      restaurants = restaurants.filter((restaurant) =>
        restaurant.cuisine.toLowerCase().includes(cuisine!.toLowerCase()),
      );
    }

    if (vegOnly) {
      restaurants = restaurants.filter((restaurant) =>
        restaurant.menus.some((menu) => menu.isVeg && menu.isAvailable),
      );
    }

    if (rating !== undefined) {
      restaurants = restaurants.filter((restaurant) => {
        if (restaurant.reviews.length === 0) {
          return false;
        }

        let totalRating = 0;

        for (const review of restaurant.reviews) {
          totalRating += review.rating;
        }

        const averageRating = totalRating / restaurant.reviews.length;

        return averageRating >= rating!;
      });
    }

    return restaurants;
  }

  @Query(() => [Restaurant])
  async GetRestaurants(): Promise<Restaurant[]> {
    return await restaurantRepository.find({
      where: {
        status: RestaurantStatus.APPROVED,
      },
      relations: {
        menus: true,
        reviews: true,
      },
    });
  }
  @Query(() => Restaurant, { name: "GetReaturantDetail" })
async GetRestaurantDetail(
  @Arg("restaurantID", () => Int) restaurantId: number,
  @Ctx() ctx: Context,
): Promise<Restaurant> {
  isAuth(ctx);

  const restaurant = await restaurantRepository.findOne({
    where: {
      id: restaurantId,
    },
    relations: {
      menus: true,
      reviews: {
        user: true,
      },
      owner: true,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return restaurant;
}
}
