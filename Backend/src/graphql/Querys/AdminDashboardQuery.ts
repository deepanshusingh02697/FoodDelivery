import { Arg, Ctx, Float, Int, ObjectType, Field, Query, Resolver } from "type-graphql";
import { Context, isAdmin } from "../../../graphql/context.js";
import {
  orderRepository,
  restaurantRepository,
  userRepository,
} from "../../repositories/repository.js";
import {
  RestaurantStatus,
} from "../../entity/Restaurant.entity.js";
import { OrderStatus } from "../../entity/Order.entity.js";
import { Role } from "../../entity/User.entity.js";

@ObjectType()
class StatusCount {
  @Field(() => String)
  status: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
class AdminDashboardPayload {
  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Int)
  totalOrders: number;

  @Field(() => Int)
  totalRestaurants: number;

  @Field(() => Int)
  totalCustomers: number;

  @Field(() => Int)
  pendingRestaurants: number;

  @Field(() => [StatusCount])
  ordersByStatus: StatusCount[];
}

@Resolver()
export class AdminDashboardQuery {
  @Query(() => AdminDashboardPayload)
  async GetAdminDashboard(
    @Ctx() ctx: Context,
  ): Promise<AdminDashboardPayload> {
    isAdmin(ctx);

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

      ordersByStatus[order.status] =
        (ordersByStatus[order.status] || 0) + 1;
    }

    const orderStatusArray: StatusCount[] = [];

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