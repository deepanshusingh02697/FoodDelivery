import {
  menuItemRepository,
  restaurantRepository,
} from "../repositories/repository.js";

import { RestaurantStatus } from "../entity/restaurant.entity.js";
import {
  checkCategory,
  checkDescription,
  checkImageUrl,
  checkName,
  checkPrice,
} from "../../validation/validate.js";

export class MenuItemService {
  async CreateMenuItem(input: any, userId: number) {
    checkName(input.name);
    checkDescription(input.description);
    checkPrice(input.price);
    checkCategory(input.category);
    checkImageUrl(input.imageUrl);

    const restaurant = await restaurantRepository.findOneBy({
      ownerId: userId,
      status: RestaurantStatus.APPROVED,
    });

    if (!restaurant) {
      throw new Error("No approved restaurant found for this owner");
    }

    if (
      input.trackStock &&
      (input.stockQuantity === undefined || input.stockQuantity === null)
    ) {
      throw new Error("stockQuantity is required when trackStock is enabled");
    }

    const newmenu = menuItemRepository.create({
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

    return await menuItemRepository.findOne({
      where: {
        id: newmenu.id,
      },
      relations: {
        restaurant: true,
      },
    });
  }

  async UpdateMenuItem(input: any, userId: number) {
    const menuItem = await menuItemRepository.findOne({
      where: {
        id: Number(input.menuItemId),
      },
      relations: {
        restaurant: true,
      },
    });

    if (!menuItem) {
      throw new Error("NOT_FOUND");
    }

    if (menuItem.restaurant.ownerId !== userId) {
      throw new Error("You don't own this restaurant's menu");
    }

    await menuItemRepository.update(
      {
        id: menuItem.id,
      },
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

    return await menuItemRepository.findOne({
      where: {
        id: menuItem.id,
      },
    });
  }

  async ToggleMenuItemAvailability(input: any, userId: number) {
    const menuItem = await menuItemRepository.findOne({
      where: {
        id: Number(input.menuItemId),
      },
      relations: {
        restaurant: true,
      },
    });

    if (!menuItem) {
      throw new Error("NOT_FOUND");
    }

    if (menuItem.restaurant.ownerId !== userId) {
      throw new Error("You don't own this restaurant's menu");
    }

    menuItem.isAvailable = !menuItem.isAvailable;

    return await menuItemRepository.save(menuItem);
  }

  async UpdateStock(input: any, userId: number) {
    const menuItem = await menuItemRepository.findOne({
      where: {
        id: Number(input.menuItemId),
      },
      relations: {
        restaurant: true,
      },
    });

    if (!menuItem) {
      throw new Error("NOT_FOUND");
    }

    if (menuItem.restaurant.ownerId !== userId) {
      throw new Error("You don't own this restaurant's menu");
    }

    if (!menuItem.trackStock) {
      throw new Error("Enable stock tracking on this item first");
    }

    menuItem.stockQuantity = input.stockQuantity;

    return await menuItemRepository.save(menuItem);
  }

  async DeleteMenuItem(input: any, userId: number) {
    const menuItem = await menuItemRepository.findOne({
      where: {
        id: Number(input.menuItemId),
      },
      relations: {
        restaurant: true,
      },
    });

    if (!menuItem) {
      throw new Error("NOT_FOUND");
    }

    if (menuItem.restaurant.ownerId !== userId) {
      throw new Error("You don't own this restaurant's menu");
    }

    await menuItemRepository.remove(menuItem);

    return null;
  }

  async MyRestaurantMenu(userId: number) {
    const restaurant = await restaurantRepository.findOne({
      where: {
        ownerId: userId,
      },
    });

    if (!restaurant) {
      throw new Error("No restaurant found for this owner");
    }

    return await menuItemRepository.find({
      where: {
        restaurantId: restaurant.id,
      },
    });
  }

  async GetMenuItems(restaurantId: number) {
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

export const menuItemService = new MenuItemService();
