import { Arg, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { RazorpayResponse } from "../types/RazorpayResponse.js";
import { Context } from "../middleware/context.js";
import { RazorpayService } from "../services/razorpay.service.js";

@Resolver()
export class RazorpayResolver {
  private razorpayService = new RazorpayService();

  @Mutation(() => RazorpayResponse)
  async PayOrder(
    @Arg("orderId", () => ID) orderId: string,
    @Ctx() ctx: Context,
  ) {
    return await this.razorpayService.PayOrder(orderId, ctx);
  }
}