import { OrderStatus } from "../entity/order.entity.js";
import { RestaurantStatus } from "../entity/restaurant.entity.js";
import { Role } from "../entity/user.entity.js";
import {
  orderRepository,
  restaurantRepository,
  userRepository,
} from "../repositories/repository.js";

export class AdminService {
  async getDashboard() {
    const [orders, approvedRestaurants, customers, pendingRestaurants] =
      await Promise.all([
        orderRepository.find(),
        restaurantRepository.count({
          where: {
            status: RestaurantStatus.APPROVED,
          },
        }),
        userRepository.count({
          where: {
            role: Role.CUSTOMER,
          },
        }),
        restaurantRepository.count({
          where: {
            status: RestaurantStatus.PENDING,
          },
        }),
      ]);

    let totalRevenue = 0;

    const ordersByStatus: Record<string, number> = {};

    for (const order of orders) {
      if (order.status !== OrderStatus.CANCELED) {
        totalRevenue += order.totalAmount;
      }

      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    }

    const orderStatusArray: {
      status: string;
      count: number;
    }[] = [];

    for (const status in ordersByStatus) {
      orderStatusArray.push({
        status,
        count: ordersByStatus[status],
      });
    }

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalRestaurants: approvedRestaurants,
      totalCustomers: customers,
      pendingRestaurants,
      ordersByStatus: orderStatusArray,
    };
  }
}

export const adminService = new AdminService();
