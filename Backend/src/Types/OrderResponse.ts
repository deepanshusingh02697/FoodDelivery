import { Field, ObjectType } from "type-graphql";
import { Order } from "../entity/Order.entity.js";

@ObjectType()
export class OrderResponse{

    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    msg: string;

    @Field(() => Order, { nullable: true })
    order:Order
}