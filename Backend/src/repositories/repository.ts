import { AppDataSource } from "../config/data-source.js";
import { Address } from "../entity/Address.entity.js";
import { Cart } from "../entity/Cart.entity.js";
import { CartItem } from "../entity/Cartitem.entity.js";
import { DeliveryTracking } from "../entity/Deliverytracking.entity.js";
import { MenuItem } from "../entity/Menuitem.entity.js";
import { Order } from "../entity/Order.entity.js";
import { OrderItem } from "../entity/Orderitem.entity.js";
import { Restaurant } from "../entity/Restaurant.entity.js";
import { Review } from "../entity/Review.entity.js";
import { User } from "../entity/User.entity.js";

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