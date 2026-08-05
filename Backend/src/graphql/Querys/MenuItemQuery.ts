import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { MenuItem } from "../../entity/menuitem.entity.js";
import { Context, isAuth, isOwner } from "../../middleware/context.js";
import {
  menuItemRepository,
  restaurantRepository,
} from "../../repositories/repository.js";

@Resolver()
export class MenuItemQuery {
  @Query(() => [MenuItem])
  async MyRestaurantMenu(@Ctx() ctx: Context): Promise<MenuItem[]> {
    isOwner(ctx);

    const restaurant = await restaurantRepository.findOne({
      where: {
        ownerId: ctx.userId!,
      },
    });

    if (!restaurant) {
      throw new Error("No restaurant found for this owner");
    }

    const menuItems = await menuItemRepository.find({
      where: {
        restaurantId: restaurant.id,
      },
    });

    return menuItems;
  }
  @Query(() => [MenuItem])
  async GetMenuItems(
    @Arg("restaurantID", () => Int) restaurantId: number,
    @Ctx() ctx: Context,
  ): Promise<MenuItem[]> {
    isAuth(ctx);

    const menuItems = await menuItemRepository.find({
      where: {
        restaurantId,
      },
    });

    if (menuItems.length === 0) {
      throw new Error("Menu items not found");
    }

    return menuItems;
  }
}
