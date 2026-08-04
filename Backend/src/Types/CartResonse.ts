import { Field, ObjectType } from "type-graphql";
import { Cart } from "../entity/Cart.entity.js";

@ObjectType()
export class CartResponse{

    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    msg: string;

    @Field(() => Cart)
    cart: Cart;
}