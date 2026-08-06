import DataLoader from "dataloader";
import {
  cartItemRepository,
  cartRepository,
  menuItemRepository,
  orderRepository,
  restaurantRepository,
  reviewRepository,
  userRepository,
} from "../repositories/repository.js";
import { User } from "../entity/user.entity.js";
import { In } from "typeorm";
import { Order } from "../entity/order.entity.js";
import { Cart } from "../entity/cart.entity.js";
import { CartItem } from "../entity/cartitem.entity.js";
import { Restaurant } from "../entity/restaurant.entity.js";
import { MenuItem } from "../entity/menuitem.entity.js";
import { Review } from "../entity/review.entity.js";

export const createLoader = () => {
  return {
    userLoader: new DataLoader<number, User>(async (ids) => {
      const users = await userRepository.find({
        where: {
          id: In([...ids]),
        },
      });
      const map = new Map(users.map((u) => [u.id, u]));
      return ids.map((id) => map.get(id) || new Error(`User ${id} not found`));
    }),
    ordersByAddressLoader: new DataLoader<number, Order[]>(async (ids) => {
      const orders = await orderRepository.find({
        where: {
          deliveryAddressId: In([...ids]),
        },
      });

      const orderMap = new Map<number, Order[]>();

      ids.forEach((id) => {
        orderMap.set(id, []);
      });

      orders.forEach((order) => {
        orderMap.get(order.deliveryAddressId)?.push(order);
      });

      return ids.map((id) => orderMap.get(id) || []);
    }),

    cartItemsByCartLoader: new DataLoader<number, CartItem[]>(
      async (cartIds) => {
        const items = await cartItemRepository.find({
          where: {
            cartId: In([...cartIds]),
          },
          relations: {
            menuItem: true,
          },
        });

        const map = new Map<number, CartItem[]>();

        cartIds.forEach((id) => {
          map.set(id, []);
        });

        items.forEach((item) => {
          map.get(item.cartId)?.push(item);
        });

        return cartIds.map((id) => map.get(id) || []);
      },
    ),
    restaurantLoader: new DataLoader<number, Restaurant>(async (ids) => {
      const restaurants = await restaurantRepository.find({
        where: {
          id: In([...ids]),
        },
      });
      const map = new Map(
        restaurants.map((restaurant) => [restaurant.id, restaurant]),
      );
      return ids.map(
        (id) => map.get(id) || new Error(`Restaurant ${id} not found`),
      );
    }),

    cartLoader: new DataLoader<number, Cart>(async (cartIds) => {
      const carts = await cartRepository.find({
        where: {
          id: In([...cartIds]),
        },
      });

      const cartMap = new Map(carts.map((cart) => [cart.id, cart]));

      return cartIds.map(
        (id) => cartMap.get(id) || new Error(`Cart ${id} not found`),
      );
    }),

    menuItemLoader: new DataLoader<number, MenuItem>(async (menuItemIds) => {
      const menuItems = await menuItemRepository.find({
        where: {
          id: In([...menuItemIds]),
        },
      });

      const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

      return menuItemIds.map(
        (id) => menuItemMap.get(id) || new Error(`MenuItem ${id} not found`),
      );
    }),

    reviewsByRestaurantLoader: new DataLoader<number, Review[]>(
      async (restaurantIds) => {
        const reviews = await reviewRepository.find({
          where: {
            restaurantId: In([...restaurantIds]),
          },
        });

        const map = new Map<number, Review[]>();

        restaurantIds.forEach((id) => map.set(id, []));

        reviews.forEach((review) => {
          map.get(review.restaurantId)?.push(review);
        });

        return restaurantIds.map((id) => map.get(id) || []);
      },
    ),

    menuItemsByRestaurantLoader: new DataLoader<number, MenuItem[]>(
      async (restaurantIds) => {
        const menuItems = await menuItemRepository.find({
          where: {
            restaurantId: In([...restaurantIds]),
          },
        });

        const map = new Map<number, MenuItem[]>();

        restaurantIds.forEach((id) => map.set(id, []));

        menuItems.forEach((item) => {
          map.get(item.restaurantId)?.push(item);
        });

        return restaurantIds.map((id) => map.get(id) || []);
      },
    ),

    ordersByUserLoader: new DataLoader<number, Order[]>(async (userIds) => {
      const orders = await orderRepository.find({
        where: {
          userId: In([...userIds]),
        },
      });

      const map = new Map<number, Order[]>();

      userIds.forEach((id) => map.set(id, []));

      orders.forEach((order) => {
        map.get(order.userId)?.push(order);
      });

      return userIds.map((id) => map.get(id) || []);
    }),
  };
};

