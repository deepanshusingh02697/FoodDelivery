import { Arg, Ctx, ID, Int, Query, Resolver } from "type-graphql";
import { Context, isAuth } from "../../../graphql/context.js";
import { Cart } from "../../entity/Cart.entity.js";
import { cartRepository } from "../../repositories/repository.js";

@Resolver()
export class CartQuery {
  @Query(() => Cart)
  async GetCart(
    @Arg("restaurantId", () => ID) restaurantId: number,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const cart = await cartRepository.findOne({
      where: {
        userId: ctx.userId!,
        restaurantId: Number(restaurantId),
      },
      relations: {
        items: {
          menuItem: true,
        },
        restaurant: true,
      },
    });

    return cart;
  }
}
