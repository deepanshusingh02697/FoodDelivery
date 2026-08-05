/* import { Arg, Ctx, Float, Int, ObjectType, Field, Query, Resolver } from "type-graphql";
import {
  orderRepository,
  restaurantRepository,
  userRepository,
} from "../repositories/repository.js";
import {
  RestaurantStatus,
} from "../entity/restaurant.entity.js";
import { OrderStatus } from "../entity/order.entity.js";
import { Role } from "../entity/user.entity.js";
import { Context, isAdmin } from "../middleware/context.js";

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
  async GetAdminDahsboard(
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
} */
import {
  Ctx,
  Int,
  ObjectType,
  Field,
  Float,
  Query,
  Resolver,
} from "type-graphql";
import { Context, isAdmin } from "../middleware/context.js";
import { adminService } from "../services/admin.service.js";

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
  async GetAdminDahsboard(@Ctx() ctx: Context): Promise<AdminDashboardPayload> {
    isAdmin(ctx);

    return await adminService.getDashboard();
  }
}
