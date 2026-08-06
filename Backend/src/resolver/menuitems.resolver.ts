import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";
import {
  CreateMenuItemInput,
  UpdateStockInput,
} from "../Input/menuitem.input.js";
import { Context, isOwner } from "../middleware/context.js";
import { menuItemService } from "../services/menuitems.service.js";
import { MenuItemResponse } from "../Types/MenuItemResponse.js";
import { Restaurant } from "../entity/restaurant.entity.js";
import { MenuItem } from "../entity/menuitem.entity.js";

@Resolver(()=>MenuItem)
export class MenuItemResolver {
  @Mutation(() => MenuItemResponse)
  async CreateMenuItem(
    @Arg("input", () => CreateMenuItemInput) input: CreateMenuItemInput,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemService.CreateMenuItem(input, ctx.userId!);

    return {
      success: true,
      msg: "Menu item created",
      menuItem,
    };
  }

  @Mutation(() => MenuItemResponse)
  async UpdateStock(
    @Arg("input", () => UpdateStockInput) input: UpdateStockInput,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemService.UpdateStock(input, ctx.userId!);

    return {
      success: true,
      msg: "Stock updated",
      menuItem,
    };
  }
  @FieldResolver(() => Restaurant)
  async restaurant(@Root() menuItem: MenuItem, @Ctx() ctx: Context) {
    return ctx.loaders.restaurantLoader.load(menuItem.restaurantId);
  }
}
