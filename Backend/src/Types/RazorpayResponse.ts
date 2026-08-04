import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class RazorpayOrder {
  @Field(() => String)
  id: string;

  @Field(() => Int)
  amount: number;

  @Field(() => String)
  currency: string;

  @Field(() => String, { nullable: true })
  receipt?: string;

  @Field(() => String)
  status: string;
}

@ObjectType()
export class RazorpayResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  msg: string;

  @Field(() => RazorpayOrder, { nullable: true })
  razorpayOrder?: RazorpayOrder;
}