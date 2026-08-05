import { AppDataSource } from "../config/data-source.js";
import { Address } from "../entity/address.entity.js";
import { Cart } from "../entity/cart.entity.js";
import { CartItem } from "../entity/cartitem.entity.js";
import { DeliveryTracking } from "../entity/deliverytracking.entity.js";
import { MenuItem } from "../entity/menuitem.entity.js";
import { Order } from "../entity/order.entity.js";
import { OrderItem } from "../entity/orderitem.entity.js";
import { Restaurant } from "../entity/restaurant.entity.js";
import { Review } from "../entity/review.entity.js";
import { User } from "../entity/user.entity.js";

export const userRepository=AppDataSource.getRepository(User)
export const addressRepository = AppDataSource.getRepository(Address);

export const restaurantRepository =
  AppDataSource.getRepository(Restaurant);

export const menuItemRepository =
  AppDataSource.getRepository(MenuItem);

export const cartRepository =
  AppDataSource.getRepository(Cart);

export const cartItemRepository =
  AppDataSource.getRepository(CartItem);

export const orderRepository =
  AppDataSource.getRepository(Order);

export const orderItemRepository =
  AppDataSource.getRepository(OrderItem);

export const reviewRepository =
  AppDataSource.getRepository(Review);

export const deliveryTrackingRepository =
  AppDataSource.getRepository(DeliveryTracking);