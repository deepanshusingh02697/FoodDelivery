import { Field, ID, InputType } from "type-graphql";
import { OrderStatus } from "../entity/order.entity.js";

@InputType()
export class PlaceOrderInput {
  @Field(() => ID)
  cartId!: string;

  @Field(() => ID)
  addressId!: string;
}

@InputType()
export class UpdateOrderStatusInput {
  @Field(() => ID)
  orderId!: string;

  @Field(() => OrderStatus)
  status!: OrderStatus;
}

@InputType()
export class VerifyPaymentInput {
  @Field(() => ID)
  orderId!: string;

  @Field(() => String)
  razorpayOrderId!: string;

  @Field(() => String)
  razorpayPaymentId!: string;

  @Field(() => String)
  razorpaySignature!: string;
}

@InputType()
export class AssignDeliveryPartnerInput {
  @Field(() => ID)
  orderId!: string;

  @Field(() => ID)
  deliveryPartnerId!: string;
}
