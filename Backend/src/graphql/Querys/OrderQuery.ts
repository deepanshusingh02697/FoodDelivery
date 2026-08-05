import { Ctx, Query, Resolver } from "type-graphql";
import { Context, isAuth, isOwner } from "../../middleware/context.js";
import { Order } from "../../entity/order.entity.js";
import { orderRepository, restaurantRepository } from "../../repositories/repository.js";

@Resolver()
export class OrderQuery {
  @Query(() => [Order])
  async MyOrders(@Ctx() ctx: Context) {
    isAuth(ctx);

    return await orderRepository.find({
      where: {
        userId: ctx.userId!,
      },
      relations: {
        items: true,
        restaurant: true,
      },
      order: {
        placedAt: "DESC",
      },
    });
  }
  @Query(() => [Order])
  async RestaurantOrders(@Ctx() ctx: Context) {
    isOwner(ctx);

    const restaurant = await restaurantRepository.findOne({
      where: {
        ownerId: ctx.userId!,
      },
    });

    if (!restaurant) {
      throw new Error("No restaurant found for this owner");
    }

    return await orderRepository.find({
      where: {
        restaurantId: restaurant.id,
      },
      relations: {
        items: true,
        user: true,
      },
      order: {
        placedAt: "DESC",
      },
    });
  }
}
