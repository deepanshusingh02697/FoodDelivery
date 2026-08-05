import { Arg, Ctx, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import { RestaurantResponse } from "../types/RestaurantResponse.js";
import { Restaurant } from "../entity/restaurant.entity.js";
import { Context } from "../middleware/context.js";
import {
  FilterRestaurantsInput,
  RegisterRestaurantOwnerInput,
} from "../Input/restaurant.input.js";
import { RestaurantService } from "../services/restaurant.service.js";

@Resolver()
export class RestaurantResolver {
  private restaurantService = new RestaurantService();

  @Mutation(() => RestaurantResponse)
  async RegisterRestaurantOwner(
    @Arg("input", () => RegisterRestaurantOwnerInput)
    input: RegisterRestaurantOwnerInput,
  ) {
    return await this.restaurantService.RegisterRestaurantOwner(input);
  }

  @Mutation(() => RestaurantResponse)
  async ApproveRestaurant(
    @Arg("restaurantId", () => ID) restaurantId: string,
    @Ctx() ctx: Context,
  ) {
    return await this.restaurantService.ApproveRestaurant(restaurantId, ctx);
  }

  @Mutation(() => RestaurantResponse)
  async RejectRestaurant(
    @Arg("restaurantId", () => ID) restaurantId: number,
    @Ctx() ctx: Context,
  ) {
    return await this.restaurantService.RejectRestaurant(restaurantId, ctx);
  }

  @Query(() => [Restaurant])
  async GetPendingRestaurants(@Ctx() ctx: Context): Promise<Restaurant[]> {
    return await this.restaurantService.GetPendingRestaurants(ctx);
  }

  @Query(() => [Restaurant])
  async FilterRestaurants(
    @Arg("input", () => FilterRestaurantsInput)
    input: FilterRestaurantsInput,
    @Ctx() ctx: Context,
  ): Promise<Restaurant[]> {
    return await this.restaurantService.FilterRestaurants(input, ctx);
  }

  @Query(() => [Restaurant])
  async GetRestaurants(): Promise<Restaurant[]> {
    return await this.restaurantService.GetRestaurants();
  }

  @Query(() => Restaurant, { name: "GetReaturantDetail" })
  async GetRestaurantDetail(
    @Arg("restaurantID", () => Int) restaurantId: number,
    @Ctx() ctx: Context,
  ): Promise<Restaurant> {
    return await this.restaurantService.GetRestaurantDetail(restaurantId, ctx);
  }
}
