/* import {
  Arg,
  Ctx,
  Float,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { MenuItemResponse } from "../types/MenuItemResponse.js";
import { Context, isAuth, isOwner } from "../middleware/context.js";
import {
  checkCategory,
  checkDescription,
  checkImageUrl,
  checkName,
  checkPrice,
} from "../../validation/validate.js";
import {
  menuItemRepository,
  restaurantRepository,
} from "../repositories/repository.js";
import { RestaurantStatus } from "../entity/restaurant.entity.js";
import {
  CreateMenuItemInput,
  MenuItemIdInput,
  UpdateMenuItemInput,
  UpdateStockInput,
} from "../Input/menuitem.input.js";
import { MenuItem } from "../entity/menuitem.entity.js";

@Resolver()
export class MenuItemResolver {
  @Mutation(() => MenuItemResponse)
  async CreateMenuItem(
    @Arg("input", () => CreateMenuItemInput) input: CreateMenuItemInput,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);
    checkName(input.name);
    checkDescription(input.description);
    checkPrice(input.price);
    checkCategory(input.category);
    checkImageUrl(input.imageUrl);

    const restaurant = await restaurantRepository.findOneBy({
      ownerId: ctx.userId!,
      status: RestaurantStatus.APPROVED,
    });

    if (!restaurant)
      throw new Error("No approved restaurant found for this owner");

    if (
      input.trackStock &&
      (input.stockQuantity === undefined || input.stockQuantity === null)
    ) {
      throw new Error("stockQuantity is required when trackStock is enabled");
    }

    const newmenu = await menuItemRepository.create({
      name: input.name,
      description: input.description?.trim(),
      price: Math.round(input.price * 100) / 100,
      category: input.category,
      isVeg: input.isVeg,
      imageUrl: input.imageUrl,
      trackStock: input.trackStock ?? false,
      stockQuantity: input.trackStock ? input.stockQuantity : undefined,
      restaurantId: restaurant.id,
    });
    await menuItemRepository.save(newmenu);

    const menu = await menuItemRepository.findOne({
      where: { id: newmenu.id },
      relations: { restaurant: true },
    });

    return { success: true, msg: "Menu item created", menuItem: menu };
  }
  @Mutation(() => MenuItemResponse)
  async UpdateMenuItem(
    @Arg("input", () => UpdateMenuItemInput) input: UpdateMenuItemInput,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemRepository.findOne({
      where: { id: Number(input.menuItemId) },
      relations: { restaurant: true },
    });

    if (!menuItem) throw new Error("NOT_FOUND");

    if (menuItem.restaurant.ownerId !== ctx.userId) {
      throw new Error("You don't own this restaurant's menu");
    }

    await menuItemRepository.update(
      { id: menuItem.id },
      {
        name: input.name,
        description: input.description,
        price:
          input.price !== undefined
            ? Math.round(input.price * 100) / 100
            : undefined,
        category: input.category,
        isVeg: input.isVeg,
        imageUrl: input.imageUrl,
      },
    );

    const updated = await menuItemRepository.findOne({
      where: { id: menuItem.id },
    });

    return {
      success: true,
      msg: "Menu item updated",
      menuItem: updated,
    };
  }
  @Mutation(() => MenuItemResponse)
  async ToggleMenuItemAvailability(
    @Arg("input", () => MenuItemIdInput) input: MenuItemIdInput,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemRepository.findOne({
      where: { id: Number(input.menuItemId) },
      relations: { restaurant: true },
    });

    if (!menuItem) throw new Error("NOT_FOUND");

    if (menuItem.restaurant.ownerId !== ctx.userId) {
      throw new Error("You don't own this restaurant's menu");
    }

    menuItem.isAvailable = !menuItem.isAvailable;

    const updated = await menuItemRepository.save(menuItem);

    return {
      success: true,
      msg: "Availability updated",
      menuItem: updated,
    };
  }
  @Mutation(() => MenuItemResponse)
  async UpdateStock(
    @Arg("input", () => UpdateStockInput) input: UpdateStockInput,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemRepository.findOne({
      where: { id: Number(input.menuItemId) },
      relations: { restaurant: true },
    });

    if (!menuItem) {
      throw new Error("NOT_FOUND");
    }

    if (menuItem.restaurant.ownerId !== ctx.userId) {
      throw new Error("You don't own this restaurant's menu");
    }

    if (!menuItem.trackStock) {
      throw new Error("Enable stock tracking on this item first");
    }

    menuItem.stockQuantity = input.stockQuantity;

    await menuItemRepository.save(menuItem);

    return {
      success: true,
      msg: "Stock updated",
      menuItem,
    };
  }
  @Mutation(() => MenuItemResponse)
  async DeleteMenuItem(
    @Arg("input", () => MenuItemIdInput) input: MenuItemIdInput,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemRepository.findOne({
      where: { id: Number(input.menuItemId) },
      relations: { restaurant: true },
    });

    if (!menuItem) {
      throw new Error("NOT_FOUND");
    }

    if (menuItem.restaurant.ownerId !== ctx.userId) {
      throw new Error("You don't own this restaurant's menu");
    }

    await menuItemRepository.remove(menuItem);

    return {
      success: true,
      msg: "Menu item deleted",
      menuItem: null,
    };
  }

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
 */

import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MenuItemResponse } from "../types/MenuItemResponse.js";
import {
  CreateMenuItemInput,
  UpdateStockInput,
} from "../Input/menuitem.input.js";
import { Context, isOwner } from "../middleware/context.js";
import { menuItemService } from "../services/menuitems.service.js";

@Resolver()
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
}
