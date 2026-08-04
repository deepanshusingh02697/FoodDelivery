import { Arg, Ctx, ID, Int, Mutation, Resolver } from "type-graphql";
import { RazorpayResponse } from "../../Types/RazorpayResponse.js";
import { Context, isAuth } from "../../../graphql/context.js";
import { razorpay } from "../../../Razorpay/Razorpay.js";
import { orderRepository } from "../../repositories/repository.js";

@Resolver()
export class RazorpayResolver {
  @Mutation(() => RazorpayResponse)
  async PayOrder(
    @Arg("orderId",()=>ID)orderId:string,
    @Ctx()ctx:Context
  ){
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
          amount: Math.round(order.totalAmount * 100), // Amount in paise
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