import { Arg, Ctx, Float, ID, Int, Mutation, Resolver } from "type-graphql";
import { MenuItemResponse } from "../../Types/MenuItemResponse.js";
import { Context, isOwner } from "../../../graphql/context.js";
import {
  checkCategory,
  checkDescription,
  checkImageUrl,
  checkName,
  checkPrice,
} from "../../../Validation/validate.js";
import {
  menuItemRepository,
  restaurantRepository,
} from "../../repositories/repository.js";
import { RestaurantStatus } from "../../entity/Restaurant.entity.js";

@Resolver()
export class MenuItemResolver {
  @Mutation(() => MenuItemResponse)
  async CreateMenuItem(
    @Arg("name",()=>String) name: string,
    @Arg("price", () => Float) price: number,
    @Arg("category",()=>String) category: string,
    @Arg("isVeg",()=>Boolean) isVeg: boolean,

    @Ctx() ctx: Context,

    @Arg("imageUrl", () => String, { nullable: true }) imageUrl?: string,
    @Arg("trackStock", () => Boolean, { nullable: true }) trackStock?: boolean,
    @Arg("stockQuantity", () => Int, { nullable: true })
    stockQuantity?: number,
    @Arg("description", () => String, { nullable: true }) description?: string,
  ) {
    isOwner(ctx);
    checkName(name);
    checkDescription(description);
    checkPrice(price);
    checkCategory(category);
    checkImageUrl(imageUrl);

    const restaurant = await restaurantRepository.findOneBy({
      ownerId: ctx.userId!,
      status: RestaurantStatus.APPROVED,
    });

    if (!restaurant)
      throw new Error("No approved restaurant found for this owner");

    if (trackStock && (stockQuantity === undefined || stockQuantity === null)) {
      throw new Error("stockQuantity is required when trackStock is enabled");
    }

    const newmenu = await menuItemRepository.create({
      name: name,
      description: description?.trim(),
      price: Math.round(price * 100) / 100,
      category: category,
      isVeg: isVeg,
      imageUrl: imageUrl,
      trackStock: trackStock ?? false,
      stockQuantity: trackStock ? stockQuantity : undefined,
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
    @Ctx() ctx: Context,
    @Arg("menuItemId", () => ID) menuItemId: string,
    @Arg("name", () => String, { nullable: true }) name?: string,
    @Arg("description", () => String, { nullable: true }) description?: string,
    @Arg("price", () => Float, { nullable: true }) price?: number,
    @Arg("category", () => String, { nullable: true }) category?: string,
    @Arg("isVeg", () => Boolean, { nullable: true }) isVeg?: boolean,
    @Arg("imageUrl", () => String, { nullable: true }) imageUrl?: string,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemRepository.findOne({
      where: { id: Number(menuItemId) },
      relations: { restaurant: true },
    });

    if (!menuItem) throw new Error("NOT_FOUND");

    if (menuItem.restaurant.ownerId !== ctx.userId) {
      throw new Error("You don't own this restaurant's menu");
    }

    await menuItemRepository.update(
      { id: menuItem.id },
      {
        name,
        description,
        price: price !== undefined ? Math.round(price * 100) / 100 : undefined,
        category,
        isVeg,
        imageUrl,
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
    @Arg("menuItemId", () => ID) menuItemId: string,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemRepository.findOne({
      where: { id: Number(menuItemId) },
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
    @Arg("menuItemId", () => ID) menuItemId: string,
    @Arg("stockQuantity", () => Int) stockQuantity: number,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemRepository.findOne({
      where: { id: Number(menuItemId) },
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

    menuItem.stockQuantity = stockQuantity;

    await menuItemRepository.save(menuItem);

    return {
      success: true,
      msg: "Stock updated",
      menuItem,
    };
  }
  @Mutation(() => MenuItemResponse)
  async DeleteMenuItem(
    @Arg("menuItemId", () => ID) menuItemId: string,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);

    const menuItem = await menuItemRepository.findOne({
      where: { id: Number(menuItemId) },
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
}
