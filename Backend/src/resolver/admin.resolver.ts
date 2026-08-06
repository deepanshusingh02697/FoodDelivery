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
