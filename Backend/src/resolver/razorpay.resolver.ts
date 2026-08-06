import { Arg, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { Context } from "../middleware/context.js";
import { RazorpayService } from "../services/razorpay.service.js";
import { RazorpayResponse } from "../Types/RazorpayResponse.js";

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