import { Context, isAuth } from "../middleware/context.js";
import { orderRepository } from "../repositories/repository.js";
import { razorpay } from "../razorpay/Razorpay.js";

export class RazorpayService {
  async PayOrder(orderId: string, ctx: Context) {
    isAuth(ctx);

    const order = await orderRepository.findOne({
      where: {
        id: Number(orderId),
      },
    });

    if (!order) {
      throw new Error("NOT_FOUND");
    }

    if (order.userId !== ctx.userId) {
      throw new Error("Not your order");
    }

    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
        receipt: `order_${order.id}`,
      });

      return {
        success: true,
        msg: "Razorpay order created",
        razorpayOrder,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error in Razorpay services");
    }
  }
}