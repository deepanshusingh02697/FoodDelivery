import { Arg, Ctx, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import { OrderResponse } from "../types/OrderResponse.js";
import { Context, isAuth, isOwner } from "../middleware/context.js";
import {
  addressRepository,
  cartRepository,
  orderRepository,
  restaurantRepository,
  userRepository,
} from "../repositories/repository.js";
import crypto from "crypto";
import { AppDataSource } from "../config/data-source.js";
import { MenuItem } from "../entity/menuitem.entity.js";
import { Order, OrderStatus } from "../entity/order.entity.js";
import { OrderItem } from "../entity/orderitem.entity.js";
import { Cart } from "../entity/cart.entity.js";
import { CartItem } from "../entity/cartitem.entity.js";
import {
  AssignDeliveryPartnerInput,
  PlaceOrderInput,
  UpdateOrderStatusInput,
  VerifyPaymentInput,
} from "../Input/order.input.js";

@Resolver()
export class OrderResolver {
  @Mutation(() => OrderResponse)
  async PlaceOrder(
    @Arg("input", () => PlaceOrderInput) input: PlaceOrderInput,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const cart = await cartRepository.findOne({
      where: {
        id: Number(input.cartId),
      },
      relations: {
        items: {
          menuItem: true,
        },
      },
    });

    if (!cart) {
      throw new Error("NOT_FOUND");
    }

    if (cart.userId !== ctx.userId) {
      throw new Error("not your cart");
    }

    if (cart.items.length === 0) {
      throw new Error("cart is empty");
    }

    const address = await addressRepository.findOne({
      where: {
        id: Number(input.addressId),
      },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    if (address.userId !== ctx.userId) {
      throw new Error("Not your address");
    }

    const addressSnapshot = [
      address.addressLine1,
      address.city,
      address.state,
      address.pincode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const menuItemRepository = queryRunner.manager.getRepository(MenuItem);

      const orderRepository = queryRunner.manager.getRepository(Order);

      const orderItemRepository = queryRunner.manager.getRepository(OrderItem);

      for (const item of cart.items) {
        if (item.menuItem.trackStock) {
          const result = await menuItemRepository
            .createQueryBuilder()
            .update(MenuItem)
            .set({
              stockQuantity: () => `"stockQuantity" - ${item.quantity}`,
            })
            .where("id = :id", {
              id: item.menuItemId,
            })
            .andWhere("stockQuantity >= :quantity", {
              quantity: item.quantity,
            })
            .execute();

          if (result.affected === 0) {
            throw new Error(`${item.menuItem.name} no longer has enough stock`);
          }
        }
      }

      const subtotal = cart.items.reduce(
        (sum, item) => sum + item.priceAtAdd * item.quantity,
        0,
      );

      const deliveryFee = 49;

      const totalAmount = subtotal + deliveryFee;

      const order = orderRepository.create({
        userId: ctx.userId!,
        restaurantId: cart.restaurantId,
        deliveryAddressId: address.id,
        addressSnapshot,
        subtotal,
        deliveryFee,
        totalAmount,
      });

      const savedOrder = await orderRepository.save(order);

      const orderItems = cart.items.map((item) =>
        orderItemRepository.create({
          orderId: savedOrder.id,
          menuItemId: item.menuItemId,
          nameSnapshot: item.menuItem.name,
          priceSnapshot: item.priceAtAdd,
          quantity: item.quantity,
        }),
      );

      await orderItemRepository.save(orderItems);

      await queryRunner.commitTransaction();

      const fullOrder = await orderRepository.findOne({
        where: {
          id: savedOrder.id,
        },
        relations: {
          items: true,
        },
      });

      return {
        success: true,
        msg: "Order placed",
        order: fullOrder,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Mutation(() => OrderResponse)
  async UpdateOrderStatus(
    @Arg("input", () => UpdateOrderStatusInput) input: UpdateOrderStatusInput,
    @Ctx() ctx: Context,
  ) {
    const order = await orderRepository.findOne({
      where: {
        id: Number(input.orderId),
      },
      relations: {
        restaurant: true,
      },
    });

    if (!order) throw new Error("Order not found");

    switch (ctx.role) {
      case "OWNER":
        if (order.restaurant.ownerId !== ctx.userId) {
          throw new Error("Not your restaurant's order");
        }

        if (
          !["PLACED", "PREPARING"].includes(order.status) ||
          !["PREPARING", "CANCELED"].includes(status)
        ) {
          throw new Error("Invalid status update");
        }
        break;

      case "CUSTOMER":
        if (order.userId !== ctx.userId) {
          throw new Error("Not your order");
        }

        if (order.status !== "PLACED" || status !== "CANCELED") {
          throw new Error("You can only cancel a placed order");
        }
        break;

      case "DELIVERY_PARTNER":
        if (order.deliveryPartnerId !== ctx.userId) {
          throw new Error("Not assigned to you");
        }

        if (
          !["PREPARING", "OUT_FOR_DELIVERY"].includes(order.status) ||
          status !== "DELIVERED"
        ) {
          throw new Error("Invalid delivery status update");
        }
        break;

      default:
        throw new Error("Unauthorized");
    }

    order.status = input.status;

    const updated = await orderRepository.save(order);

    return {
      success: true,
      msg: "Order status updated",
      order: updated,
    };
  }

  @Mutation(() => OrderResponse)
  async VerifyPayment(
    @Arg("input", () => VerifyPaymentInput) input: VerifyPaymentInput,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const body = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== input.razorpaySignature) {
      throw new Error("Payment verification failed");
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderRepository = queryRunner.manager.getRepository(Order);

      const cartRepository = queryRunner.manager.getRepository(Cart);

      const cartItemRepository = queryRunner.manager.getRepository(CartItem);

      const order = await orderRepository.findOne({
        where: {
          id: Number(input.orderId),
        },
      });

      if (!order) {
        throw new Error("NOT_FOUND");
      }

      if (order.userId !== ctx.userId) {
        throw new Error("This isn't your order");
      }

      order.status = OrderStatus.PREPARING;

      const updated = await orderRepository.save(order);

      const cart = await cartRepository.findOne({
        where: {
          userId: ctx.userId!,
        },
      });

      if (cart) {
        await cartItemRepository.delete({
          cartId: cart.id,
        });
      }
      await queryRunner.commitTransaction();
      return {
        success: true,
        msg: "Payment verified",
        order: updated,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  @Mutation(() => OrderResponse)
  async AssignDeliveryPartner(
    @Arg("input", () => AssignDeliveryPartnerInput)
    input: AssignDeliveryPartnerInput,
    @Ctx() ctx: Context,
  ) {
    isOwner(ctx);
    const order = await orderRepository.findOne({
      where: { id: Number(input.orderId) },
      relations: { restaurant: true },
    });
    if (!order) throw new Error("NOT_FOUND");
    if (order.restaurant.ownerId !== ctx.userId)
      throw new Error("Not your restaurant's order");
    if (order.status !== "PREPARING") {
      throw new Error(
        "Order must be PREPARING before assigning a delivery partner",
      );
    }

    const partner = await userRepository.findOne({
      where: { id: Number(input.deliveryPartnerId) },
    });

    if (!partner || partner.role !== "DELIVERY_PARTNER") {
      throw new Error("Invalid delivery partner");
    }

    order.deliveryPartnerId = partner.id;
    order.status = OrderStatus.OUT_FOR_DELIVERY;

    const updated = await orderRepository.save(order);

    return {
      success: true,
      msg: "Delivery partner assigned",
      order: updated,
    };
  }

  @Query(() => [Order])
  async MyOrders(@Ctx() ctx: Context) {
    isAuth(ctx);

    return await orderRepository.find({
      where: {
        userId: ctx.userId!,
      },
      relations: {
        items: true,
        restaurant: true,
      },
      order: {
        placedAt: "DESC",
      },
    });
  }
  @Query(() => [Order])
  async RestaurantOrders(@Ctx() ctx: Context) {
    isOwner(ctx);

    const restaurant = await restaurantRepository.findOne({
      where: {
        ownerId: ctx.userId!,
      },
    });

    if (!restaurant) {
      throw new Error("No restaurant found for this owner");
    }

    return await orderRepository.find({
      where: {
        restaurantId: restaurant.id,
      },
      relations: {
        items: true,
        user: true,
      },
      order: {
        placedAt: "DESC",
      },
    });
  }
}
